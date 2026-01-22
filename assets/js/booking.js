document.addEventListener("DOMContentLoaded", function () {

  // PRENDE TUTTI I POSSIBILI TRIGGER (ID DUPLICATO SAFE)
  const heroPrenotaBtns = document.querySelectorAll("#heroPrenota");

  // ELEMENTI DA NASCONDERE
  const heroBadges = document.querySelectorAll(".hero-badge");
  const heroActions = document.querySelectorAll(".hero-actions");
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const ctaWrap = document.querySelector(".cta-wrap");
  const showcase = document.querySelector(".showcase");

  // SEZIONE BOOKING (INIZIALMENTE display:none)
  const bookingCont = document.querySelector(".section2");

  // SICUREZZA
  if (!heroPrenotaBtns.length) {
    console.error("❌ Nessun #heroPrenota trovato");
    return;
  }

  heroPrenotaBtns.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      // NASCONDE HERO
      heroBadges.forEach(el => el.style.display = "none");
      heroActions.forEach(el => el.style.display = "none");

      if (heroTitle) heroTitle.style.display = "none";
      if (heroSubtitle) heroSubtitle.style.display = "none";
      if (ctaWrap) ctaWrap.style.display = "none";
      if (showcase) showcase.style.display = "none";

      // MOSTRA BOOKING
      if (bookingCont) {
        bookingCont.style.display = "block";
      }

    });
  });

});





/**
 * 3. LOGICA TAB INTERNI (DOTAZIONI / EXTRA)
 */
window.toggleBoatTab = function(event, tabId) {
    const container = event.currentTarget.closest('.elite-edition');
    
    // Switch Bottoni
    container.querySelectorAll('.p-tab').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // Switch Pannelli
    container.querySelectorAll('.p-tab-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    const activePanel = document.getElementById(tabId);
    if (activePanel) {
        activePanel.classList.add('active');
        activePanel.style.display = 'block';
    }
};

/**
 * 4. CALCOLO DINAMICO PREZZI EXTRA
 */
window.calculateTotalWithExtras = function(index) {
    const boatCards = document.querySelectorAll('.boat-card');
    const card = boatCards[index];
    if (!card) return;

    const basePrice = parseFloat(card.querySelector('.base-price-value')?.innerText) || 0;
    let extrasTotal = 0;

    card.querySelectorAll(".extra-checkbox:checked").forEach(cb => {
        extrasTotal += parseInt(cb.dataset.price || 0);
    });

    const totalDisplay = card.querySelector('.total-price-display');
    if (totalDisplay) {
        totalDisplay.innerText = basePrice + extrasTotal;
    }
};

/**
 * 5. LOGICA PRENOTAZIONE E MODALE
 */
function prenota(idx) {
    // Controllo se il giorno è selezionato
    if (!STATE.selectedDays[idx]) {
        const alertbtn = document.getElementById("alert");
        const alertWidget = document.getElementById("booking-widget");
        if(alertbtn) alertbtn.style.display = "block";
        if(alertWidget) alertWidget.style.boxShadow = "0 0 10px rgba(207, 25, 25, 0.4)";
        return;
    }

    const card = document.querySelectorAll('.boat-card')[idx];
    const monthIndex = STATE.dates[idx].getMonth();
    
    // Calcolo Totale per il Riepilogo
    const basePrice = Math.round(CONFIG.basePrices[idx] * (CONFIG.multipliers[monthIndex] || 1));
    const selectedExtrasNames = [];
    let extrasTotal = 0;

    card.querySelectorAll(".extra-checkbox:checked").forEach(cb => {
        extrasTotal += parseInt(cb.dataset.price || 0);
        selectedExtrasNames.push(cb.dataset.name || "Extra");
    });

    // Salvataggio dati nello Stato
    STATE.currentBookingData = {
        boatName: card.querySelector("h3")?.innerText || "Barca",
        dateStr: `${STATE.selectedDays[idx]} ${CONFIG.months[monthIndex]} 2024`,
        finalPrice: basePrice + extrasTotal,
        selectedExtras: selectedExtrasNames
    };

    // Rendering template checkout
    const summaryContainer = document.getElementById("modal-summary");
    if (summaryContainer && typeof getCheckoutTemplate === "function") {
        summaryContainer.innerHTML = getCheckoutTemplate({
            ...STATE.currentBookingData,
            missingExtras: CONFIG.allExtras.filter(ex => !selectedExtrasNames.includes(ex))
        });
    }
}



function toggleDetailsAndReset(idx) {
  const card = getCard(idx);
  if (!card) return;

  card.querySelector(".boat-details-extended")?.classList.toggle("open");
  card.querySelector(".arrow-toggle")?.classList.toggle("rotate-icon");
}

function resetExtrasOnly(idx) {
  const card = getCard(idx);
  if (!card) return;

  card
    .querySelectorAll(".extra-checkbox")
    .forEach((cb) => (cb.checked = false));
  calculateTotalWithExtras(idx);
}

// Helper per recuperare la card
const getCard = (idx) => document.querySelectorAll(".boat-card")[idx];

/**
 * 4. LOGICA CALENDARIO E PREZZI
 */
function calculateTotalWithExtras(idx) {
  const card = getCard(idx);
  const msgEl = card?.querySelector(".selected-date-msg");
  if (!card || !msgEl) return;

  if (STATE.selectedDays[idx] === null) {
    msgEl.innerText = "Seleziona una data per vedere disponibilità";
    return;
  }

  const monthIndex = STATE.dates[idx].getMonth();
  const base = CONFIG.basePrices[idx];
  const mult = CONFIG.multipliers[monthIndex] || 1;
  const dailyPrice = Math.round(base * mult);

  const extrasTotal = Array.from(
    card.querySelectorAll(".extra-checkbox:checked"),
  ).reduce((sum, cb) => sum + parseInt(cb.getAttribute("data-price") || 0), 0);

  msgEl.innerHTML = `Scelto: ${STATE.selectedDays[idx]} ${CONFIG.months[monthIndex]} - Prezzo totale: <b>€${dailyPrice + extrasTotal}</b>`;
}

function renderCalendar(idx) {
  const card = getCard(idx);
  if (!card) return;

  const date = STATE.dates[idx];
  const month = date.getMonth();
  const year = date.getFullYear();
  const container = card.querySelector(".calendar-grid");

  // Update Header
  card.querySelector(".month-year-display").innerText =
    `${CONFIG.months[month]} ${year}`;

  const isSelectable = month >= 4 && month <= 8; // Maggio - Settembre
  const currentPrice = isSelectable
    ? Math.round(CONFIG.basePrices[idx] * (CONFIG.multipliers[month] || 0))
    : "---";
  card.querySelector(".price-display").innerText = isSelectable
    ? `€${currentPrice}`
    : "---";

  // Build Grid
  container.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay();
  const emptySlots = firstDay === 0 ? 6 : firstDay - 1;

  // Empty slots
  for (let i = 0; i < emptySlots; i++) {
    const div = document.createElement("div");
    div.className = "day-item empty";
    container.appendChild(div);
  }

  // Days
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day-item";
    dayDiv.innerText = day;

    if (STATE.selectedDays[idx] === day) dayDiv.classList.add("selected");

    if (isSelectable) {
      dayDiv.onclick = () => {
        if (STATE.selectedDayElements[idx])
          STATE.selectedDayElements[idx].classList.remove("selected");
        dayDiv.classList.add("selected");
        STATE.selectedDayElements[idx] = dayDiv;
        STATE.selectedDays[idx] = day;
        calculateTotalWithExtras(idx);
      };
    } else {
      dayDiv.classList.add("disabled");
    }
    container.appendChild(dayDiv);
  }
}

function changeMonth(step, idx) {
  STATE.dates[idx].setMonth(STATE.dates[idx].getMonth() + step);
  STATE.selectedDayElements[idx] = null;
  STATE.selectedDays[idx] = null;
  renderCalendar(idx);
  calculateTotalWithExtras(idx);
}
