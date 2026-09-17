const accordions = [...document.querySelectorAll('[data-accordion]')];
const mobileLayout = window.matchMedia('(max-width: 900px)');

function activatePanel(panels, panel) {
  panels.forEach((item) => {
    const active = item === panel;
    item.classList.toggle('is-active', active);
    item.querySelector('.panel-trigger')?.setAttribute('aria-expanded', String(active));
  });
}

accordions.forEach((accordion) => {
  const panels = [...accordion.querySelectorAll('[data-panel]')];

  panels.forEach((panel, index) => {
    const trigger = panel.querySelector('.panel-trigger');

    panel.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse' && !mobileLayout.matches) activatePanel(panels, panel);
    });

    trigger?.addEventListener('click', () => {
      if (mobileLayout.matches && panel.classList.contains('is-active')) {
        activatePanel(panels, null);
        return;
      }

      activatePanel(panels, panel);
    });

    trigger?.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
      const next = panels[(index + direction + panels.length) % panels.length];
      activatePanel(panels, next);
      next.querySelector('.panel-trigger')?.focus();
    });
  });
});

function setInitialPanelState() {
  accordions.forEach((accordion) => {
    const panels = [...accordion.querySelectorAll('[data-panel]')];
    activatePanel(panels, mobileLayout.matches ? null : panels[0]);
  });
}

mobileLayout.addEventListener('change', setInitialPanelState);
setInitialPanelState();

document.getElementById('year').textContent = new Date().getFullYear();
