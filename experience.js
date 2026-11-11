const figure = document.querySelector('.fig-in');
if (figure) figure.dataset.paused = 'false';   // Solomun siempre en movimiento

const archive = document.querySelector('.tour-archive');
if (archive) {
const selector = archive.querySelector('.tour-select');
const flyers = [...archive.querySelectorAll('.flyer')];
const showColors = ['#e9e476', '#aee7c5', '#e9b8b0', '#becbf1', '#99ddfe'];
const showButtons = flyers.map((flyer, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = flyer.querySelector('figcaption span').textContent;
  flyer.id = 'flyer-' + (index + 1);
  button.setAttribute('aria-controls', flyer.id);
  selector.append(button);
  return button;
});

function showFlyer(index) {
  for (const [position, flyer] of flyers.entries()) {
    const selected = index === position;
    flyer.hidden = !selected;
    showButtons[position].setAttribute('aria-pressed', String(selected));
  }
  archive.style.setProperty('--show-color', showColors[index]);
}

showButtons.forEach((button, index) => button.addEventListener('click', () => showFlyer(index)));
showFlyer(0);
archive.classList.add('is-interactive');
selector.hidden = false;
}


const booking = document.querySelector('.booking-desk');
const copyStatus = booking.querySelector('.copy-status');
if (navigator.clipboard?.writeText) {
  for (const link of booking.querySelectorAll('.cell a[href^="mailto:"]')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-contact';
    button.textContent = 'Copiar correo';
    button.setAttribute('aria-label', 'Copiar ' + link.textContent);
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(link.textContent.trim());
        copyStatus.textContent = 'Copiado: ' + link.textContent.trim();
      } catch {
        copyStatus.textContent = 'No se pudo copiar. Seleccioná la dirección para copiarla.';
      }
    });
    link.after(button);
  }
}
