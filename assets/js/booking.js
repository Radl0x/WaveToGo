(() => {
  const PRICES = { day: 250, am: 170, pm: 170 };
  const DEPOSIT = 50;
  const CAUTION = 400;

  // Sostituisci qui con i tuoi extra reali (dal tuo HTML)
  const EXTRAS = [
    { id:"skipper", label:"Skipper professionista", desc:"Ideale per prime esperienze", price:120, icon:"👤", type:"toggle" },
    { id:"snorkel", label:"Set snorkeling", desc:"Maschera + boccaglio", price:10, icon:"🤿", type:"qty", min:0, max:8, step:1 },
    { id:"cooler", label:"Borsa frigo + ghiaccio", desc:"Bibite fresche", price:15, icon:"🧊", type:"toggle" },
    { id:"insurance", label:"Assicurazione estesa", desc:"Copertura extra", price:35, icon:"🛡️", type:"toggle" },
  ];

  // tabs/panels
  const tabs = Object.fromEntries([1,2,3,4,5].map(n => [n, document.getElementById(`pm-tab-${n}`)]));
  const panels = Object.fromEntries([1,2,3,4,5].map(n => [n, document.getElementById(`pm-step-${n}`)]));
  const progress = document.getElementById("pm-progress");
  const status = document.getElementById("pm-status");

  // controls
  const btnBack = document.getElementById("pm-back");
  const btnNext = document.getElementById("pm-next");

  // step1
  const dateInp = document.getElementById("pm-date");
  const slotSel = document.getElementById("pm-slot");
  const startInp = document.getElementById("pm-start");
  const endInp = document.getElementById("pm-end");
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

  // mini summary (rail)
  const miniTotal = document.getElementById("pm-miniTotal");
  const miniBase = document.getElementById("pm-miniBase");
  const miniExtra = document.getElementById("pm-miniExtra");

  // review step5
  const rDate = document.getElementById("pm-r-date");
  const rTime = document.getElementById("pm-r-time");
  const rSlot = document.getElementById("pm-r-slot");
  const rExtras = document.getElementById("pm-r-extras");
  const rBase = document.getElementById("pm-r-base");
  const rExtraTotal = document.getElementById("pm-r-extraTotal");
  const rTotal = document.getElementById("pm-r-total");

  // accordion
  document.getElementById("pm-acc")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pm-accBtn");
    if (!btn) return;
    const key = btn.dataset.acc;
    const panel = document.getElementById(`pm-acc-${key}`);
    if (!panel) return;
    const isOpen = panel.classList.contains("pm-accOpen");
    // close all
    document.querySelectorAll("#pm-acc .pm-accPanel").forEach(p => p.classList.remove("pm-accOpen"));
    // open selected
    if (!isOpen) panel.classList.add("pm-accOpen");
  });

  // state
  let step = 1;
  const unlocked = new Set([1]);
  const extraState = {};
  EXTRAS.forEach(x => extraState[x.id] = (x.type === "qty") ? 0 : false);

  const euro = (n) => `${Math.round(n)}€`;
  const basePrice = () => PRICES[slotSel.value] ?? 0;
  const slotLabel = (v) => ({day:"Giornata intera",am:"Mezza giornata (mattina)",pm:"Mezza giornata (pomeriggio)"}[v] || "—");

  function setDefaults(){
    const v = slotSel.value;
    if (v==="day"){ startInp.value="09:00"; endInp.value="18:00"; }
    if (v==="am"){ startInp.value="09:00"; endInp.value="13:30"; }
    if (v==="pm"){ startInp.value="14:00"; endInp.value="18:30"; }
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

  function extrasText(){
    const arr = [];
    for (const x of EXTRAS){
      const v = extraState[x.id];
      if (x.type==="toggle" && v) arr.push(x.label);
      if (x.type==="qty" && v>0) arr.push(`${x.label} ×${v}`);
    }
    return arr.length ? arr.join(", ") : "—";
  }

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
        <span class="pm-ico" aria-hidden="true">${x.icon}</span>
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

  function updateSummary(){
    const b = basePrice();
    const e = extraTotal();
    const t = total();

    miniBase.textContent = euro(b);
    miniExtra.textContent = euro(e);
    miniTotal.textContent = euro(t);

    // step 5
    rDate.textContent = dateInp.value || "—";
    rTime.textContent = (startInp.value && endInp.value) ? `${startInp.value} → ${endInp.value}` : "—";
    rSlot.textContent = slotLabel(slotSel.value);
    rExtras.textContent = extrasText();
    rBase.textContent = euro(b);
    rExtraTotal.textContent = euro(e);
    rTotal.textContent = euro(t);
  }

  function setProgress(){
    progress.style.width = `${((step-1)/4)*100}%`;
    status.textContent = `Step ${step}`;
  }

  function setHeader(){
    const map = {
      1: ["Seleziona data e fascia oraria", "Mezza giornata o giornata intera"],
      2: ["Scegli gli extra", "Aggiungi servizi opzionali."],
      3: ["Inserisci i tuoi dati", "Servono per confermare la richiesta."],
      4: ["Termini e condizioni", "."],
      5: ["Riepilogo e invio", "Controlla tutto e invia la richiesta."],
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
    btnNext.textContent = (step === 5) ? "Invia richiesta" : "Continua";

    setHeader();
    setProgress();
    updateSummary();
    document.getElementById("pm-book").scrollIntoView({ behavior:"smooth", block:"start" });
  }

  function showErr(el, msg){ el.textContent = msg; el.classList.add("pm-show"); }
  function clearErr(el){ el.textContent = ""; el.classList.remove("pm-show"); }

  function validStep1(){
    clearErr(err1);
    if (!dateInp.value) return showErr(err1, "Seleziona una data."), false;
    if (!startInp.value || !endInp.value) return showErr(err1, "Seleziona arrivo e ritorno."), false;
    if (endInp.value <= startInp.value) return showErr(err1, "Il ritorno deve essere dopo l’arrivo."), false;
    return true;
  }

  function validStep3(){
    clearErr(err3);
    if (!nameInp.value.trim()) return showErr(err3, "Inserisci nome e cognome."), false;
    if (!phoneInp.value.trim()) return showErr(err3, "Inserisci un telefono."), false;
    if (!emailInp.value.trim() || !emailInp.value.includes("@")) return showErr(err3, "Inserisci una email valida."), false;
    return true;
  }

  // tabs click (solo unlocked)
  Object.values(tabs).forEach(btn => {
    btn.addEventListener("click", () => go(Number(btn.dataset.step)));
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
      updateSummary();
      return;
    }

    if (type === "toggle") extraState[id] = !extraState[id];
    else extraState[id] = (extraState[id] > 0) ? 0 : 1;

    syncExtrasUI();
    updateSummary();
  });

  // step1 changes
  slotSel.addEventListener("change", () => { setDefaults(); updateSummary(); });
  [dateInp, startInp, endInp].forEach(el => el.addEventListener("change", updateSummary));

  // footer nav
  btnBack.addEventListener("click", () => go(Math.max(1, step-1)));
  btnNext.addEventListener("click", () => {
    // validation gates
    if (step === 1 && !validStep1()) return;
    if (step === 3 && !validStep3()) return;

    if (step < 5){
      unlock(step + 1);
      go(step + 1);
      return;
    }

    // send (step5)
    const payload = {
      date: dateInp.value,
      slot: slotSel.value,
      start: startInp.value,
      end: endInp.value,
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
  });

  // init
  renderExtras();
  setDefaults();
  setHeader();
  setProgress();
  updateSummary();
  go(1);
})();
