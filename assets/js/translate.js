(() => {

  const languages = [
    { code: "it", label: "Italiano", flagUrl: "https://flagcdn.com/w40/it.png" },
    { code: "en", label: "English",  flagUrl: "https://flagcdn.com/w40/gb.png" },
    { code: "es", label: "Spanish",  flagUrl: "https://flagcdn.com/w40/es.png" },
    { code: "ru", label: "Russian",  flagUrl: "https://flagcdn.com/w40/ru.png" },
    { code: "pl", label: "Polski",   flagUrl: "https://flagcdn.com/w40/pl.png" },
  ];

  const box = document.getElementById("lingue-box");
  if (!box) return;

  let current = languages[0];

  // ðŸ”¹ Funzione che crea il menu escludendo la lingua corrente
  function renderMenu() {
    const langMenu = document.getElementById("langMenu");

    langMenu.innerHTML = languages
      .filter(l => l.code !== current.code) // <-- ESCLUDE lingua attiva
      .map(l => `
        <button class="lang-item" type="button" data-code="${l.code}">
          <img class="lang-flag-img" src="${l.flagUrl}" alt="${l.label}">
        </button>
      `).join("");
  }

  box.innerHTML = `
    <div class="lang-switch">
      <button class="lang-btn" id="langBtn" type="button">
        <img class="lang-flag-img" id="currentFlagImg" src="${current.flagUrl}" alt="${current.label}">
        <span class="lang-caret">â–¾</span>
      </button>

      <div class="lang-menu" id="langMenu"></div>
    </div>
  `;

  const langBtn = document.getElementById("langBtn");
  const langMenu = document.getElementById("langMenu");
  const currentFlagImg = document.getElementById("currentFlagImg");

  renderMenu(); // ðŸ”¹ inizializza menu

  const openMenu = () => langMenu.classList.add("open");
  const closeMenu = () => langMenu.classList.remove("open");

  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.classList.toggle("open");
  });

  langMenu.addEventListener("click", (e) => {
    const item = e.target.closest(".lang-item");
    if (!item) return;

    const selected = languages.find(l => l.code === item.dataset.code);
    if (!selected) return;

    current = selected;

    // aggiorna bandiera visibile
    currentFlagImg.src = current.flagUrl;
    currentFlagImg.alt = current.label;

    localStorage.setItem("site_lang", current.code);

    renderMenu(); // ðŸ”¹ rigenera menu senza la lingua selezionata
    closeMenu();
  });

  document.addEventListener("click", closeMenu);

  // ðŸ”¹ Ripristino lingua salvata
  const saved = localStorage.getItem("site_lang");
  if (saved) {
    const savedLang = languages.find(l => l.code === saved);
    if (savedLang) {
      current = savedLang;
      currentFlagImg.src = current.flagUrl;
      renderMenu();
    }
  }

})();
