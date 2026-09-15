document.getElementById('year').textContent = new Date().getFullYear();

const lightbox = document.getElementById('art-lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxSource = lightbox?.querySelector('.lightbox-source');

document.querySelectorAll('.gallery-open').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxSource) return;

    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.dataset.alt;
    lightboxCaption.textContent = button.dataset.caption;
    lightboxSource.href = button.dataset.instagram;
    lightbox.showModal();
  });
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
