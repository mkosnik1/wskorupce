const panels = [...document.querySelectorAll('[data-panel]')];
const mobileLayout = window.matchMedia('(max-width: 900px)');

function activatePanel(panel) {
  panels.forEach((item) => {
    const active = item === panel;
    item.classList.toggle('is-active', active);
    item.querySelector('.panel-trigger')?.setAttribute('aria-expanded', String(active));
  });
}

panels.forEach((panel, index) => {
  const trigger = panel.querySelector('.panel-trigger');

  panel.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && !mobileLayout.matches) activatePanel(panel);
  });

  trigger?.addEventListener('click', () => {
    if (mobileLayout.matches && panel.classList.contains('is-active')) {
      activatePanel(null);
      return;
    }

    activatePanel(panel);
  });
  trigger?.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const next = panels[(index + direction + panels.length) % panels.length];
    activatePanel(next);
    next.querySelector('.panel-trigger')?.focus();
  });
});

function setInitialPanelState() {
  activatePanel(mobileLayout.matches ? null : panels[0]);
}

mobileLayout.addEventListener('change', setInitialPanelState);
setInitialPanelState();

const aboutCard = document.querySelector('[data-about]');
const aboutDetails = aboutCard?.querySelector('.about-details');
const aboutTrigger = aboutCard?.querySelector('.about-trigger');

function setAboutState(open) {
  aboutCard?.classList.toggle('is-open', open);
  aboutTrigger?.setAttribute('aria-expanded', String(open));
}

aboutDetails?.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse' && !mobileLayout.matches) setAboutState(true);
});

aboutCard?.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'mouse' && !mobileLayout.matches) setAboutState(false);
});

aboutTrigger?.addEventListener('click', () => {
  setAboutState(!aboutCard.classList.contains('is-open'));
});

document.getElementById('year').textContent = new Date().getFullYear();
