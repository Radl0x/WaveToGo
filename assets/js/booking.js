(() => {
  const PRICES = { day: 250, am: 170, pm: 170 };
  const DEPOSIT = 50;
  const CAUTION = 400;

  const EXTRAS = [
    { id:"skipper", label:"Skipper professionista", desc:"Ideale per prime esperienze", price:120, icon:"fa-solid fa-user-tie", type:"toggle" },
    { id:"snorkel", label:"Set snorkeling", desc:"Maschera + boccaglio", price:10, icon:"fa-solid fa-mask", type:"qty", min:0, max:8, step:1 },
    { id:"social", label:"Social Ready", desc:"GoPro + accessori", price:10, icon:"fa-solid fa-camera", type:"toggle" },
    { id:"cooler", label:"Borsa frigo + ghiaccio", desc:"Bibite fresche", price:15, icon:"fa-solid fa-snowflake", type:"toggle" },
    { id:"insurance", label:"Assicurazione estesa", desc:"Copertura extra", price:35, icon:"fa-solid fa-shield-halved", type:"toggle" },
  ];

  // tabs/panels (✅ solo 1..4)
  const tabs = Object.fromEntries([1,2,3,4].map(n => [n, document.getElementById(`pm-tab-${n}`)]));
  const panels = Object.fromEntries([1,2,3,4].map(n => [n, document.getElementById(`pm-step-${n}`)]));
  const progress = document.getElementById("pm-progress");
  const status = document.getElementById("pm-status");

  // controls
  const btnBack = document.getElementById("pm-back");
  const btnNext = document.getElementById("pm-next");

  // step1
  const dateInp = document.getElementById("pm-date");
  const slotSel = document.getElementById("pm-slot");
  const baseHint = document.getElementById("pm-baseHint");
  const err1 = document.getElementById("pm-err-1");

  // step3
  const nameInp = document.getElementById("pm-name");
  const phoneInp = document.getElementById("pm-phone");
  const emailInp = document.getElementById("pm-email");
  const notesInp = document.getElementById("pm-notes");
  const err3 = document.getElementById("pm-err-3");

  // headers
  const headTitle = document.getElementById("pm-headTitle");
  const headSub = document.getElementById("pm-headSub");

  // extras
  const extrasWrap = document.getElementById("pm-extras");

  // accordion (ok se esiste)
  document.getElementById("pm-acc")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pm-accBtn");
    if (!btn) return;
    const key = btn.dataset.acc;
    const panel = document.getElementById(`pm-acc-${key}`);
    if (!panel) return;
    const isOpen = panel.classList.contains("pm-accOpen");
    document.querySelectorAll("#pm-acc .pm-accPanel").forEach(p => p.classList.remove("pm-accOpen"));
    if (!isOpen) panel.classList.add("pm-accOpen");
  });

  // state
  let step = 1;
  const unlocked = new Set([1]);
  const extraState = {};
  EXTRAS.forEach(x => extraState[x.id] = (x.type === "qty") ? 0 : false);

  const euro = (n) => `${Math.round(n)}€`;
  const slotValue = () => (document.getElementById("pm-slot")?.value || "day");
  const basePrice = () => PRICES[slotValue()] ?? 0;

  function setDefaults(){
    baseHint.textContent = `Prezzo base: ${euro(basePrice())}`;
  }

  function extraTotal(){
    let sum = 0;
    for (const x of EXTRAS){
      const v = extraState[x.id];
      if (x.type==="toggle" && v) sum += x.price;
      if (x.type==="qty" && v>0) sum += x.price * v;
    }
    return sum;
  }

  function total(){ return basePrice() + extraTotal(); }

  function renderExtras(){
    extrasWrap.innerHTML = "";
    EXTRAS.forEach(x => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "pm-extra";
      row.dataset.id = x.id;
      row.dataset.type = x.type;
      row.dataset.checked = "false";
      row.setAttribute("role", "checkbox");
      row.setAttribute("aria-checked", "false");

      row.innerHTML = `
        <span class="pm-cb" aria-hidden="true"></span>
        <span class="pm-ico" aria-hidden="true"><i class="${x.icon}"></i></span>
        <span class="pm-extraTxt"><b>${x.label}</b><small>${x.desc}</small></span>
        ${x.type==="qty" ? `
          <span class="pm-qty" aria-label="Quantità">
            <button type="button" data-q="dec" aria-label="Diminuisci">−</button>
            <span data-q="val">0</span>
            <button type="button" data-q="inc" aria-label="Aumenta">+</button>
          </span>
        ` : `<span></span>`}
        <span class="pm-price">+${euro(x.price)}</span>
      `;
      extrasWrap.appendChild(row);
    });
    syncExtrasUI();
  }

  function syncExtrasUI(){
    extrasWrap.querySelectorAll(".pm-extra").forEach(row => {
      const id = row.dataset.id;
      const type = row.dataset.type;
      const v = extraState[id];
      const checked = (type==="toggle") ? !!v : (v>0);
      row.dataset.checked = checked ? "true" : "false";
      row.setAttribute("aria-checked", checked ? "true" : "false");
      const val = row.querySelector('[data-q="val"]');
      if (val) val.textContent = String(v);
    });
  }

  function updateMini(){
    // se hai il mini rail, qui puoi aggiornarlo; altrimenti non fa nulla
    const miniTotal = document.getElementById("pm-miniTotal");
    const miniBase  = document.getElementById("pm-miniBase");
    const miniExtra = document.getElementById("pm-miniExtra");
    if (!miniTotal || !miniBase || !miniExtra) return;

    const b = basePrice();
    const e = extraTotal();
    const t = total();
    miniBase.textContent = euro(b);
    miniExtra.textContent = euro(e);
    miniTotal.textContent = euro(t);
  }

  function setProgress(){
    // ✅ 4 step → (step-1)/3
    progress.style.width = `${((step-1)/3)*100}%`;
    status.textContent = `Step ${step}`;
  }

  function setHeader(){
    const map = {
      1: ["Seleziona data ", "Mezza giornata o giornata intera"],
      2: ["Scegli gli extra", "Aggiungi servizi opzionali."],
      3: ["Inserisci i tuoi dati", "Servono per confermare la richiesta."],
      4: ["Termini e condizioni", "Conferma per inviare la richiesta."],
    };
    headTitle.textContent = map[step][0];
    headSub.textContent = map[step][1];
  }

  function unlock(n){
    unlocked.add(n);
    tabs[n].disabled = false;
    tabs[n].classList.remove("pm-lock");
  }

  function go(n){
    if (!unlocked.has(n)) return;
    step = n;

    Object.values(panels).forEach(p => p.classList.remove("pm-show"));
    panels[n].classList.add("pm-show");

    Object.values(tabs).forEach(t => t.classList.remove("pm-on"));
    tabs[n].classList.add("pm-on");

    btnBack.disabled = (step === 1);
    btnNext.textContent = (step === 4) ? "Invia richiesta" : "Continua";

    setHeader();
    setProgress();
    updateMini();

    // ✅ NIENTE scrollIntoView sul form: ad ogni cambio step vai in alto
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function showErr(el, msg){ el.textContent = msg; el.classList.add("pm-show"); }
  function clearErr(el){ el.textContent = ""; el.classList.remove("pm-show"); }

  function validStep1(){
    clearErr(err1);
    if (!dateInp.value) return showErr(err1, "⚠️ Seleziona una data."), false;
    return true;
  }

  function validStep3(){
    clearErr(err3);
    if (!nameInp.value.trim()) return showErr(err3, "Inserisci nome e cognome."), false;
    if (!phoneInp.value.trim()) return showErr(err3, "Inserisci un telefono."), false;
    if (!emailInp.value.trim() || !emailInp.value.includes("@")) return showErr(err3, "Inserisci una email valida."), false;
    return true;
  }

  function sendRequest(){
    const payload = {
      date: dateInp.value,
      slot: slotValue(),
      extras: EXTRAS.map(x => ({...x, value: extraState[x.id]}))
        .filter(x => (x.type==="toggle" ? x.value : x.value>0)),
      pricing: {
        base: basePrice(),
        extras_total: extraTotal(),
        total: total(),
        deposit: DEPOSIT,
        caution: CAUTION
      },
      customer: {
        name: nameInp.value.trim(),
        phone: phoneInp.value.trim(),
        email: emailInp.value.trim(),
        notes: (notesInp?.value || "").trim()
      }
    };

    alert("✅ Richiesta inviata! (guarda la Console)");
    console.log("PM BOOKING REQUEST:", payload);
  }

  // tabs click (solo unlocked)
  Object.values(tabs).forEach(btn => {
    btn?.addEventListener("click", () => go(Number(btn.dataset.step)));
  });

  // extras click
  extrasWrap.addEventListener("click", (e) => {
    const row = e.target.closest(".pm-extra");
    if (!row) return;

    const id = row.dataset.id;
    const type = row.dataset.type;

    const qBtn = e.target.closest('button[data-q]');
    if (qBtn){
      const action = qBtn.dataset.q;
      const cfg = EXTRAS.find(x => x.id === id);
      const cur = extraState[id];
      if (action === "inc") extraState[id] = Math.min((cfg.max ?? 99), cur + (cfg.step ?? 1));
      if (action === "dec") extraState[id] = Math.max((cfg.min ?? 0), cur - (cfg.step ?? 1));
      syncExtrasUI();
      updateMini();
      return;
    }

    if (type === "toggle") extraState[id] = !extraState[id];
    else extraState[id] = (extraState[id] > 0) ? 0 : 1;

    syncExtrasUI();
    updateMini();
  });

  // step1 changes
  slotSel?.addEventListener("change", () => { setDefaults(); updateMini(); });
  dateInp?.addEventListener("change", updateMini);

  // footer nav
  btnBack.addEventListener("click", () => go(Math.max(1, step-1)));
  btnNext.addEventListener("click", () => {
    if (step === 1 && !validStep1()) return;
    if (step === 3 && !validStep3()) return;

    if (step < 4){
      unlock(step + 1);
      go(step + 1);
      return;
    }

    // ✅ step 4 = invio
    sendRequest();
  });

  // init
  renderExtras();
  setDefaults();
  setHeader();
  setProgress();
  updateMini();
  go(1);
})();