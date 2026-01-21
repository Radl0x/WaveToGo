const layer = document.querySelector('.bubbles');

function spawnBubble() {
  const b = document.createElement('span');
  b.className = 'bubble';

  const size = Math.random() * 10 + 6;
  const duration = Math.random() * 6 + 8;
  const sway = Math.random() * 3 + 2;
  const opacity = (Math.random() * 0.4 + 0.25).toFixed(2);

  b.style.setProperty('--size', `${size}px`);
  b.style.setProperty('--duration', `${duration}s`);
  b.style.setProperty('--sway', `${sway}s`);
  b.style.setProperty('--opacity', opacity);
  b.style.left = `${Math.random() * 100}%`;

  layer.appendChild(b);

  // rimuovi quando finisce l’animazione
  b.addEventListener('animationend', () => b.remove());
}

// spawn sporadico: intervallo random tra 250–900ms
(function loop() {
  spawnBubble();
  const next = Math.random() * 650 + 250;
  setTimeout(loop, next);
})();