document.addEventListener("DOMContentLoaded", function () {

  // PRENDE TUTTI I POSSIBILI TRIGGER (ID DUPLICATO SAFE)
  const heroPrenotaBtns = document.querySelectorAll("#heroPrenota");

  // ELEMENTI HERO
  const heroBadges = document.querySelectorAll(".hero-badge");
  const heroActions = document.querySelectorAll(".hero-actions");
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const ctaWrap = document.querySelector(".cta-wrap");
  const showcase = document.querySelector(".showcase");

  // BOOKING
  const bookingCont = document.querySelector(".section2");

  // CLOSE BTN (può non esistere subito)
  const closeBox = document.querySelector(".close-box");

  // SICUREZZA
  if (!heroPrenotaBtns.length) {
    console.error("❌ Nessun #heroPrenota trovato");
    return;
  }

  /* =========================
     FUNZIONI RIUTILIZZABILI
  ========================== */

  function hideHero() {
    heroBadges.forEach(el => el.style.display = "none");
    heroActions.forEach(el => el.style.display = "none");
    if (heroTitle) heroTitle.style.display = "none";
    if (heroSubtitle) heroSubtitle.style.display = "none";
    if (ctaWrap) ctaWrap.style.display = "none";
    if (showcase) showcase.style.display = "none";
  }

  function showHero() {
    heroBadges.forEach(el => el.style.display = "");
    heroActions.forEach(el => el.style.display = "");
    if (heroTitle) heroTitle.style.display = "";
    if (heroSubtitle) heroSubtitle.style.display = "";
    if (ctaWrap) ctaWrap.style.display = "";
    if (showcase) showcase.style.display = "";
  }

  function showBooking() {
    if (bookingCont) bookingCont.style.display = "block";
  }

  function hideBooking() {
    if (bookingCont) bookingCont.style.display = "none";
  }

  /* =========================
     CLICK SU PRENOTA
  ========================== */

  heroPrenotaBtns.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      hideHero();
      showBooking();
    });
  });

  /* =========================
     CLICK SU CHIUDI
  ========================== */

  if (closeBox) {
    closeBox.addEventListener("click", function (e) {
      e.preventDefault();
      hideBooking();
      showHero();
    });
  }

});





// --- CONFIGURAZIONE LOGICA ---
  const PRICING = { standard: 120, mid: 180, high: 250 };
  const DEPOSIT = 50;
  let currentTotal = 0;

  // 1. Calcolo Prezzi Widget (Uguale alla tua richiesta precedente)
  const dateInput = document.getElementById('checkin');
  const widgetPriceDisplay = document.getElementById('widgetPriceDisplay');
  const widgetSummaryBox = document.getElementById('widgetSummaryBox');
  const widgetRateDisplay = document.getElementById('widgetRateDisplay');
  const widgetTotalDisplay = document.getElementById('widgetTotalDisplay');

  // Imposta data minima a oggi
  dateInput.min = new Date().toISOString().split("T")[0];
  dateInput.addEventListener('change', calculatePrice);

  function calculatePrice() {
    if (!dateInput.value) return;
    const selectedDate = new Date(dateInput.value);
    const month = selectedDate.getMonth(); // 0 = Gennaio
    
    let price = PRICING.standard;
    if (month === 4 || month === 8) price = PRICING.mid; // Maggio/Sett
    else if (month >= 5 && month <= 7) price = PRICING.high; // Giugno-Agosto

    currentTotal = price;
    
    // Update Widget UI
    widgetPriceDisplay.innerHTML = `€${price} <small>/ giorno</small>`;
    widgetSummaryBox.style.display = 'block';
    widgetRateDisplay.innerText = `€${price}`;
    widgetTotalDisplay.innerText = `€${price}`;
  }

  // 2. GESTIONE MODALE (Apertura/Chiusura)
  function openModal(e) {
    e.preventDefault(); // Ferma il submit del form standard
    if (!dateInput.value) { alert("Seleziona una data"); return; }
    
    // Aggiorna dati nel modale
    document.getElementById('modalDateDisplay').innerText = dateInput.value.split('-').reverse().join('/');
    
    // Calcolo Saldo (Totale - Acconto)
    const balance = currentTotal - DEPOSIT;
    document.getElementById('modalBalance').innerText = `€${balance}`;

    // Mostra Overlay
    const overlay = document.getElementById('checkoutModalOverlay');
    overlay.style.display = 'block';
    setTimeout(() => overlay.classList.add('open'), 10); // Trigger animazione CSS
    document.body.style.overflow = 'hidden'; // Blocca scroll pagina sotto
  }

  function closeModal() {
    const overlay = document.getElementById('checkoutModalOverlay');
    overlay.classList.remove('open');
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Riabilita scroll
    }, 300);
  }

  // 3. GESTIONE TABS MODALE
  function switchTab(tabName) {
    const contents = document.getElementsByClassName("tab-content");
    const buttons = document.getElementsByClassName("tab-btn");
    
    for (let c of contents) c.classList.remove("active");
    for (let b of buttons) b.classList.remove("active");
    
    document.getElementById('tab-' + tabName).classList.add("active");
    // Trova il bottone cliccato basandosi sull'onclick attribute o event target sarebbe meglio, 
    // ma qui semplifichiamo selezionando per indice o testo se necessario. 
    // Per semplicità, aggiungo active al bottone cliccato tramite event handling inline o loop:
    event.currentTarget.classList.add("active");
  }

  // 4. CHECKBOX TERMINI E PAGAMENTO
  function togglePayBtn() {
    const check = document.getElementById('termsCheck');
    const btn = document.getElementById('confirm-booking-btn');
    
    if(check.checked) {
        btn.disabled = false;
        btn.classList.add('active-btn');
        btn.style.background = ''; // Usa stile classe
        btn.style.color = '';
    } else {
        btn.disabled = true;
        btn.classList.remove('active-btn');
        btn.style.background = '#dfe6e9';
        btn.style.color = '#b2bec3';
    }
  }

  // Inizializzazione
  calculatePrice();