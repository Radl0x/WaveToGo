function checkoutTemplate({
  boatName,
  extrasHtml,
  missingExtrasHtml,
  deposit,
  balance
}) {
  return `
  <!-- CHECKOUT MOBILE -->
  <div id="booking-checkout-mobile" class="checkout-container">
    <!-- INCOLLA QUI TUTTO IL TUO HTML IDENTICO -->
  </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    const tab = btn.dataset.tab;

    // disattiva bottoni
    document.querySelectorAll('.tab-btn').forEach(b =>
      b.classList.remove('active')
    );

    // nasconde contenuti
    document.querySelectorAll('.tab-content').forEach(c =>
      c.classList.remove('active')
    );

    // attiva bottone
    btn.classList.add('active');

    // mostra contenuto
    const target = document.getElementById(`tab-${tab}`);
    if (target) target.classList.add('active');
  });
});

