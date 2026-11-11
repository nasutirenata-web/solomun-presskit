const motionToggle = document.querySelector('.motion-toggle');
const figure = document.querySelector('.fig-in');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function setMotionPaused(paused) {
  figure.dataset.paused = String(paused);
  motionToggle.textContent = paused ? 'Reproducir imagen' : 'Pausar imagen';
}

setMotionPaused(false);
motionToggle.hidden = false;
motionToggle.addEventListener('click', () => setMotionPaused(figure.dataset.paused !== 'true'));

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

const listeningRoom = document.querySelector('.listening-room');
const recordLabel = listeningRoom.querySelector('.record-display span');
const listenLink = listeningRoom.querySelector('.listen-link');
const releaseButtons = [...listeningRoom.querySelectorAll('li')].map(row => {
  const button = document.createElement('button');
  button.type = 'button';
  button.append(...row.children);
  row.append(button);
  return button;
});

function selectRelease(selected) {
  for (const button of releaseButtons) {
    button.setAttribute('aria-pressed', String(button === selected));
  }
  const title = selected.querySelector('.t').textContent;
  const metadata = selected.querySelector('.m').textContent;
  recordLabel.textContent = metadata.match(/\b\d{4}\b/)?.[0] ?? 'Diynamic';
  listenLink.href = 'https://open.spotify.com/search/' + encodeURIComponent('Solomun ' + title);
  listenLink.textContent = 'Buscar ' + title + ' en Spotify ↗';
}

releaseButtons.forEach(button => button.addEventListener('click', () => selectRelease(button)));
selectRelease(releaseButtons[0]);
listenLink.hidden = false;

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

/* ===== el cursor mueve a Solomun + lente amarilla (radiografía) ===== */
(function(){
  var stage = document.querySelector('.stage'), fig = document.querySelector('.stage .figure');
  if (!stage || !fig || !window.gsap) return;
  var lens = document.createElement('div');
  lens.className = 'lens'; lens.setAttribute('aria-hidden','true');
  stage.appendChild(lens);
  var fine = matchMedia('(pointer:fine)').matches;
  var qx = gsap.quickTo(fig,'x',{duration:.9,ease:'power3.out'}),
      qy = gsap.quickTo(fig,'y',{duration:.9,ease:'power3.out'}),
      qr = gsap.quickTo(fig,'rotation',{duration:1.1,ease:'power3.out'}),
      lx = gsap.quickTo(lens,'x',{duration:.25,ease:'power3.out'}),
      ly = gsap.quickTo(lens,'y',{duration:.25,ease:'power3.out'});
  gsap.set(fig,{scale:1.08,transformOrigin:'50% 40%'});
  function move(e){
    var r = stage.getBoundingClientRect(), nx = (e.clientX-r.left)/r.width-.5, ny = (e.clientY-r.top)/r.height-.5;
    qx(-nx*70); qy(-ny*40); qr(nx*3);
    lx(e.clientX-r.left); ly(e.clientY-r.top);
    lens.style.opacity = 1;
  }
  stage.addEventListener('pointermove',move);
  stage.addEventListener('pointerdown',move);
  stage.addEventListener('pointerleave',function(){ qx(0);qy(0);qr(0); lens.style.opacity = 0; });
  stage.addEventListener('pointerdown',function(){ gsap.fromTo(lens,{scale:1},{scale:1.9,duration:.25,yoyo:true,repeat:1,ease:'power2.out'}); });
})();
