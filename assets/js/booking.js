
  // ============================
  // ELEMENTI DOM
  // ============================
  const heroPrenotaBtn = document.getElementById('heroPrenota');
  const bookingPopup = document.getElementById('bookingPopup');
  const bookingPopupClose = document.getElementById('bookingPopupClose');
  const bookingPopupOverlay = document.getElementById('bookingPopupOverlay');

  // ============================
  // FUNZIONE APERTURA POPUP
  // ============================
  function openBookingPopup() {
    bookingPopup.classList.add('active');
    bookingPopup.setAttribute('aria-hidden', 'false');

    // blocca scroll pagina
    document.body.classList.add('no-scroll');
  }

  // ============================
  // FUNZIONE CHIUSURA POPUP
  // ============================
  function closeBookingPopup() {
    bookingPopup.classList.remove('active');
    bookingPopup.setAttribute('aria-hidden', 'true');

    // riabilita scroll pagina
    document.body.classList.remove('no-scroll');
  }

  // ============================
  // EVENTI
  // ============================

  // click bottone hero
  heroPrenotaBtn.addEventListener('click', openBookingPopup);

  // click X
  bookingPopupClose.addEventListener('click', closeBookingPopup);

  // click overlay
  bookingPopupOverlay.addEventListener('click', closeBookingPopup);

  // chiusura con ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && bookingPopup.classList.contains('active')) {
      closeBookingPopup();
    }
  });
