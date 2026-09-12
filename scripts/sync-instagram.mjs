import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
const userId = process.env.INSTAGRAM_USER_ID?.trim();
const apiVersion = process.env.INSTAGRAM_API_VERSION?.trim() || 'v23.0';

if (!token) throw new Error('Brakuje sekretu INSTAGRAM_ACCESS_TOKEN.');
if (!userId) throw new Error('Brakuje sekretu INSTAGRAM_USER_ID.');
if (!/^v\d+\.\d+$/.test(apiVersion)) throw new Error('Nieprawidłowy INSTAGRAM_API_VERSION.');

const endpoint = new URL(`https://graph.instagram.com/${apiVersion}/${encodeURIComponent(userId)}/media`);
endpoint.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');
endpoint.searchParams.set('limit', '12');

const apiResponse = await fetch(endpoint, {
  headers: { Authorization: `Bearer ${token}` },
});
const apiPayload = await apiResponse.json();

if (!apiResponse.ok) {
  const message = apiPayload?.error?.message || `HTTP ${apiResponse.status}`;
  throw new Error(`Instagram API zwróciło błąd: ${message}`);
}

const media = Array.isArray(apiPayload.data) ? apiPayload.data : [];
const selected = media
  .filter((item) => ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'].includes(item.media_type))
  .filter((item) => item.permalink && (item.media_url || item.thumbnail_url))
  .slice(0, 3);

if (selected.length === 0) throw new Error('Instagram API nie zwróciło postów ze zdjęciem.');

const imagesDirectory = join(process.cwd(), 'dist', 'assets', 'instagram');
const dataDirectory = join(process.cwd(), 'dist', 'data');
await mkdir(imagesDirectory, { recursive: true });
await mkdir(dataDirectory, { recursive: true });

function shortCaption(value) {
  const firstLine = String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return 'Post z Instagrama';
  return firstLine.length > 72 ? `${firstLine.slice(0, 69).trimEnd()}…` : firstLine;
}

function extensionFor(contentType) {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  return 'jpg';
}

const items = [];
const currentFiles = new Set();

for (const item of selected) {
  const imageUrl = item.media_type === 'VIDEO'
    ? item.thumbnail_url || item.media_url
    : item.media_url || item.thumbnail_url;
  const imageResponse = await fetch(imageUrl);

  if (!imageResponse.ok) throw new Error(`Nie udało się pobrać obrazu posta ${item.id}.`);

  const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
  if (!contentType.startsWith('image/')) throw new Error(`Post ${item.id} nie zwrócił obrazu.`);

  const safeId = String(item.id).replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `ig-${safeId}.${extensionFor(contentType)}`;
  const caption = shortCaption(item.caption);
  currentFiles.add(filename);
  await writeFile(join(imagesDirectory, filename), Buffer.from(await imageResponse.arrayBuffer()));

  items.push({
    id: String(item.id),
    caption,
    alt: `Post pracowni wskorupce.pl: ${caption}`,
    image: `assets/instagram/${filename}`,
    permalink: item.permalink,
    mediaType: item.media_type,
    timestamp: item.timestamp || null,
  });
}

for (const filename of await readdir(imagesDirectory)) {
  if (filename.startsWith('ig-') && !currentFiles.has(filename)) {
    await unlink(join(imagesDirectory, filename));
  }
}

const dataPath = join(dataDirectory, 'instagram.json');
let updatedAt = new Date().toISOString();

try {
  const previous = JSON.parse(await readFile(dataPath, 'utf8'));
  if (JSON.stringify(previous.items) === JSON.stringify(items)) {
    updatedAt = previous.updatedAt || updatedAt;
  }
} catch {
  // Pierwsza synchronizacja nie ma wcześniejszego pliku do porównania.
}

await writeFile(dataPath, `${JSON.stringify({ updatedAt, items }, null, 2)}\n`);

console.log(`Zapisano ${items.length} najnowsze posty z Instagrama.`);
