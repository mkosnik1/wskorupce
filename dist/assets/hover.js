const panels = [...document.querySelectorAll('[data-panel]')];

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
    if (event.pointerType === 'mouse') activatePanel(panel);
  });

  trigger?.addEventListener('click', () => activatePanel(panel));
  trigger?.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const next = panels[(index + direction + panels.length) % panels.length];
    activatePanel(next);
    next.querySelector('.panel-trigger')?.focus();
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
