function openCheckout(data) {
  const root = document.getElementById('checkout-root');

  if (root.dataset.mounted === 'true') return;

  root.innerHTML = checkoutTemplate(data);
  root.dataset.mounted = 'true';
}
