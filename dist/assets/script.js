document.getElementById('year').textContent = new Date().getFullYear();

const gallery = document.querySelector('.gallery-grid');
const cardClasses = ['card-one', 'card-two', 'card-three'];

function safeInstagramUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'instagram.com' || url.hostname.endsWith('.instagram.com'))
      ? url.href
      : null;
  } catch {
    return null;
  }
}

async function loadInstagramFeed() {
  if (!gallery) return;

  try {
    const response = await fetch('data/instagram.json', { cache: 'no-store' });
    if (!response.ok) return;

    const feed = await response.json();
    if (!Array.isArray(feed.items) || feed.items.length === 0) return;

    const fragment = document.createDocumentFragment();

    feed.items.slice(0, 3).forEach((item, index) => {
      const permalink = safeInstagramUrl(item.permalink);
      if (!permalink || typeof item.image !== 'string') return;

      const figure = document.createElement('figure');
      figure.className = `gallery-card ${cardClasses[index] || ''}`;

      const link = document.createElement('a');
      link.className = 'gallery-link';
      link.href = permalink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.alt || 'Post pracowni wskorupce.pl na Instagramie';
      image.width = 900;
      image.height = 900;
      image.loading = 'lazy';

      const caption = document.createElement('figcaption');
      caption.textContent = item.caption || 'Post z Instagrama';

      link.append(image, caption);
      figure.append(link);
      fragment.append(figure);
    });

    if (fragment.childElementCount > 0) gallery.replaceChildren(fragment);
  } catch {
    // Zostaw statyczne zdjęcia, jeśli synchronizacja jest chwilowo niedostępna.
  }
}

loadInstagramFeed();
