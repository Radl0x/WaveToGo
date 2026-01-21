// =========================
// SELETTORE LAYER
// =========================
// Seleziona solo le bolle dentro la hero
const layer = document.querySelector('.hero .bubbles');

// =========================
// CREA UNA BOLLA SINGOLA
// =========================
function spawnBubble() {
  const b = document.createElement('span');
  b.className = 'bubble';

  // ---------- PARAMETRI MODIFICABILI ----------
  const size = Math.random() * 10 + 6;    // dimensione bolla
  const duration = Math.random() * 6 + 8; // durata salita
  const sway = Math.random() * 3 + 2;     // oscillazione laterale
  const opacity = (Math.random() * 0.4 + 0.25).toFixed(2); // trasparenza
  // -------------------------------------------

  b.style.setProperty('--size', `${size}px`);
  b.style.setProperty('--duration', `${duration}s`);
  b.style.setProperty('--sway', `${sway}s`);
  b.style.setProperty('--opacity', opacity);

  // posizione orizzontale casuale
  b.style.left = `${Math.random() * 100}%`;

  layer.appendChild(b);

  // rimuove la bolla quando finisce la salita
  b.addEventListener('animationend', () => b.remove());
}

// =========================
// GENERAZIONE SPORADICA
// (più naturale, non tutte insieme)
// =========================
(function loop() {
  spawnBubble();
  const next = Math.random() * 650 + 250; // intervallo in ms (modifica qui)
  setTimeout(loop, next);
})();