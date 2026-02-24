(() => {
  "use strict";

  /* =====================================================
     BOOKING.JS — PM Checkout (WaveToGo)
     - Avvio sicuro (anche se script caricato in altre pagine)
     - Anti-null: se manca il widget esce senza crash
     - Commenti "ricercabili" per modifiche veloci
     ===================================================== */

  // =========================
  // [UTILS] Helper DOM
  // =========================

  /** [UTILS:$] Seleziona 1 elemento */
  const $ = (sel, root = document) => root.querySelector(sel);

  /** [UTILS:$$] Seleziona più elementi */
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // =========================
  // [CONFIG] Prezzi / caparra / cauzione
  // =========================

  /** [CONFIG:PRICES] Prezzi base per fascia */
  const PRICES = { day: 250, am: 170, pm: 170 };

  /** [CONFIG:DEPOSIT] Caparra */
  const DEPOSIT = 50;

  /** [CONFIG:CAUTION] Cauzione */
  const CAUTION = 400;

  // =========================
  // [CONFIG] Extra (toggle o quantità)
  // =========================

  /** [CONFIG:EXTRAS] Lista extra disponibili */
  const EXTRAS = [
    { id:"skipper",   label:"Skipper professionista", desc:"Ideale per prime esperienze", price:120, icon:"fa-solid fa-user-tie",     type:"toggle" },
    { id:"snorkel",   label:"Set snorkeling",         desc:"Maschera + boccaglio",       price:10,  icon:"fa-solid fa-mask",         type:"qty", min:0, max:8, step:1 },
    { id:"social",    label:"Social Ready",           desc:"GoPro + accessori",          price:10,  icon:"fa-solid fa-camera",       type:"toggle" },
    { id:"cooler",    label:"Borsa frigo + ghiaccio", desc:"Bibite fresche",             price:15,  icon:"fa-solid fa-snowflake",    type:"toggle" },
    { id:"insurance", label:"Assicurazione estesa",   desc:"Copertura extra",            price:35,  icon:"fa-solid fa-shield-halved", type:"toggle" },
  ];

  // =========================
  // [INIT] Funzione principale
  // =========================

  /** [INIT:init] Avvio widget booking */
  function init() {
    // [INIT:root] Se non c'è il widget in pagina, esci (evita errori se booking.js è caricato ovunque)
    const root = document.getElementById("pm-book");
    if (!root) return;

    // =========================
    // [DOM] Tabs e Panels (Step 1..4)
    // =========================

    /** [DOM:tabs] Bottoni step (pm-tab-1..4) */
    const tabs = Object.fromEntries([1,2,3,4].map(n => [n, document.getElementById(`pm-tab-${n}`)]));

    /** [DOM:panels] Sezioni step (pm-step-1..4) */
    const panels = Object.fromEntries([1,2,3,4].map(n => [n, document.getElementById(`pm-step-${n}`)]));

    /** [DOM:progress] Barra avanzamento */
    const progress = document.getElementById("pm-progress");

    /** [DOM:status] Pill "Step X" */
    const status = document.getElementById("pm-status");

    // =========================
    // [DOM] Bottoni footer
    // =========================

    /** [DOM:btnBack] Bottone Indietro */
    const btnBack = document.getElementById("pm-back");

    /** [DOM:btnNext] Bottone Continua / Invia richiesta */
    const btnNext = document.getElementById("pm-next");

    // =========================
    // [DOM] Step 1 (data / slot)
    // =========================

    /** [DOM:dateInp] Input data */
    const dateInp = document.getElementById("pm-date");

    /** [DOM:slotSel] Select fascia (day/am/pm) */
    const slotSel = document.getElementById("pm-slot");

    /** [DOM:baseHint] Testo "Prezzo base" */
    const baseHint = document.getElementById("pm-baseHint");

    /** [DOM:err1] Errore step 1 */
    const err1 = document.getElementById("pm-err-1");

    // =========================
    // [DOM] Step 3 (dati cliente)
    // =========================

    /** [DOM:nameInp] Nome e cognome */
    const nameInp = document.getElementById("pm-name");

    /** [DOM:phoneInp] Telefono */
    const phoneInp = document.getElementById("pm-phone");

    /** [DOM:emailInp] Email */
    const emailInp = document.getElementById("pm-email");

    /** [DOM:notesInp] Note (nel tuo HTML non c'è: resta null, gestito con ?. ) */
    const notesInp = document.getElementById("pm-notes");

    /** [DOM:err3] Errore step 3 */
    const err3 = document.getElementById("pm-err-3");

    // =========================
    // [DOM] Header widget
    // =========================

    /** [DOM:headTitle] Titolo step */
    const headTitle = document.getElementById("pm-headTitle");

    /** [DOM:headSub] Sottotitolo step */
    const headSub = document.getElementById("pm-headSub");

    // =========================
    // [DOM] Extras container
    // =========================

    /** [DOM:extrasWrap] Wrapper extra */
    const extrasWrap = document.getElementById("pm-extras");

    // =========================
    // [SAFEGUARD] Check elementi obbligatori
    // =========================

    /** [SAFEGUARD:required] Elementi necessari per funzionare */
    const required = {
      progress, status, btnBack, btnNext,
      dateInp, slotSel, baseHint, err1,
      nameInp, phoneInp, emailInp, err3,
      headTitle, headSub, extrasWrap,
      tab1: tabs[1], tab2: tabs[2], tab3: tabs[3], tab4: tabs[4],
      step1: panels[1], step2: panels[2], step3: panels[3], step4: panels[4],
    };

    /** [SAFEGUARD:missing] Se manca qualcosa, stop pulito */
    const missing = Object.entries(required).filter(([,v]) => !v).map(([k]) => k);
    if (missing.length) {
      console.error("[booking.js] Mancano elementi nel DOM:", missing);
      return;
    }

    // =========================
    // [STATE] Variabili di stato
    // =========================

    /** [STATE:step] Step attuale (1..4) */
    let step = 1;

    /** [STATE:unlocked] Step sbloccati (parti da 1) */
    const unlocked = new Set([1]);

    /** [STATE:extraState] Stato extra (toggle: boolean, qty: numero) */
    const extraState = {};
    EXTRAS.forEach(x => extraState[x.id] = (x.type === "qty") ? 0 : false);

    // =========================
    // [FORMAT] Utility prezzo / slot
    // =========================

    /** [FORMAT:euro] Format euro (intero) */
    const euro = (n) => `${Math.round(Number(n) || 0)}€`;

    /** [FORMAT:slotValue] Valore select fascia */
    const slotValue = () => slotSel.value || "day";

    /** [FORMAT:basePrice] Prezzo base attuale */
    const basePrice = () => PRICES[slotValue()] ?? 0;

    // =========================
    // [UI] Set default / calcoli
    // =========================

    /** [UI:setDefaults] Aggiorna hint prezzo base */
    function setDefaults(){
      baseHint.textContent = `Prezzo base: ${euro(basePrice())}`;
    }

    /** [CALC:extraTotal] Somma totale extra */
    function extraTotal(){
      let sum = 0;
      for (const x of EXTRAS){
        const v = extraState[x.id];
        if (x.type === "toggle" && v) sum += x.price;
        if (x.type === "qty" && v > 0) sum += x.price * v;
      }
      return sum;
    }

    /** [CALC:total] Totale finale (base + extra) */
    function total(){ return basePrice() + extraTotal(); }

    // =========================
    // [UI:EXTRAS] Render e sync UI extra
    // =========================

    /** [UI:renderExtras] Crea la lista extra nel DOM */
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

    /** [UI:syncExtrasUI] Allinea UI agli stati extraState */
    function syncExtrasUI(){
      $$(".pm-extra", extrasWrap).forEach(row => {
        const id = row.dataset.id;
        const type = row.dataset.type;
        const v = extraState[id];

        const checked = (type === "toggle") ? !!v : (v > 0);
        row.dataset.checked = checked ? "true" : "false";
        row.setAttribute("aria-checked", checked ? "true" : "false");

        const val = row.querySelector('[data-q="val"]');
        if (val) val.textContent = String(v);
      });
    }

    // =========================
    // [UI:MINI] Riepilogo a destra (mini total)
    // =========================

    /** [UI:updateMini] Aggiorna i 3 valori: base / extra / totale */
    function updateMini(){
      const miniTotal = document.getElementById("pm-miniTotal");
      const miniBase  = document.getElementById("pm-miniBase");
      const miniExtra = document.getElementById("pm-miniExtra");
      if (!miniTotal || !miniBase || !miniExtra) return; // se non esiste, non fa nulla

      miniBase.textContent  = euro(basePrice());
      miniExtra.textContent = euro(extraTotal());
      miniTotal.textContent = euro(total());
    }

    // =========================
    // [UI:PROGRESS] Barra avanzamento + step label
    // =========================

    /** [UI:setProgress] Aggiorna barra progress + testo Step */
    function setProgress(){
      progress.style.width = `${((step-1)/3)*100}%`;
      status.textContent = `Step ${step}`;
    }

    // =========================
    // [UI:HEADER] Titolo e sottotitolo per step
    // =========================

    /** [UI:setHeader] Aggiorna headTitle/headSub in base allo step */
    function setHeader(){
      const map = {
        1: ["Seleziona data", "Mezza giornata o giornata intera"],
        2: ["Scegli gli extra", "Aggiungi servizi opzionali."],
        3: ["Inserisci i tuoi dati", "Servono per confermare la richiesta."],
        4: ["Termini e condizioni", "Conferma per inviare la richiesta."],
      };
      headTitle.textContent = map[step][0];
      headSub.textContent   = map[step][1];
    }

    // =========================
    // [NAV] Sblocco e navigazione tra step
    // =========================

    /** [NAV:unlock] Sblocca step n (abilita tab) */
    function unlock(n){
      unlocked.add(n);
      tabs[n].disabled = false;
      tabs[n].classList.remove("pm-lock");
    }

    /** [NAV:go] Vai allo step n (solo se sbloccato) */
    function go(n){
      if (!unlocked.has(n)) return;
      step = n;

      // mostra solo il panel attuale
      Object.values(panels).forEach(p => p.classList.remove("pm-show"));
      panels[n].classList.add("pm-show");

      // evidenzia tab attuale
      Object.values(tabs).forEach(t => t.classList.remove("pm-on"));
      tabs[n].classList.add("pm-on");

      // bottoni
      btnBack.disabled = (step === 1);
      btnNext.textContent = (step === 4) ? "Invia richiesta" : "Continua";

      // aggiorna UI
      setHeader();
      setProgress();
      updateMini();

      // sempre in alto
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    // =========================
    // [VALIDATION] Error handling + validazioni step
    // =========================

    /** [VALIDATION:showErr] Mostra errore */
    function showErr(el, msg){ el.textContent = msg; el.classList.add("pm-show"); }

    /** [VALIDATION:clearErr] Pulisce errore */
    function clearErr(el){ el.textContent = ""; el.classList.remove("pm-show"); }

    /** [VALIDATION:validStep1] Controlli step 1 */
    function validStep1(){
      clearErr(err1);
      if (!dateInp.value) { showErr(err1, "⚠️ Seleziona una data."); return false; }
      return true;
    }

    /** [VALIDATION:validStep3] Controlli step 3 */
    function validStep3(){
      clearErr(err3);
      if (!nameInp.value.trim())  return (showErr(err3, "Inserisci nome e cognome."), false);
      if (!phoneInp.value.trim()) return (showErr(err3, "Inserisci un telefono."), false);
      if (!emailInp.value.trim() || !emailInp.value.includes("@"))
        return (showErr(err3, "Inserisci una email valida."), false);
      return true;
    }

    // =========================
    // [SUBMIT] Costruzione payload e invio (ora: console)
    // =========================

    /** [SUBMIT:sendRequest] Crea payload + logga (qui puoi integrare fetch/email/etc.) */
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

    // =========================
    // [EVENTS] Tabs click
    // =========================

    /** [EVENTS:tabs] Click su tab -> vai step (solo se sbloccato) */
    Object.values(tabs).forEach(btn => {
      btn.addEventListener("click", () => go(Number(btn.dataset.step)));
    });

    // =========================
    // [EVENTS] Extras click
    // =========================

    /** [EVENTS:extrasWrap] Click su extra (toggle o quantità) */
    extrasWrap.addEventListener("click", (e) => {
      const row = e.target.closest(".pm-extra");
      if (!row) return;

      const id = row.dataset.id;
      const type = row.dataset.type;

      // [EVENTS:qty] Gestione + / − per extra qty
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

      // [EVENTS:toggle] Toggle/attiva extra
      if (type === "toggle") extraState[id] = !extraState[id];
      else extraState[id] = (extraState[id] > 0) ? 0 : 1;

      syncExtrasUI();
      updateMini();
    });

    // =========================
    // [EVENTS] Step1 changes (slot/data)
    // =========================

    /** [EVENTS:slotSel] Cambio fascia -> aggiorna prezzo base + mini */
    slotSel.addEventListener("change", () => { setDefaults(); updateMini(); });

    /** [EVENTS:dateInp] Cambio data -> aggiorna mini */
    dateInp.addEventListener("change", updateMini);

    // =========================
    // [EVENTS] Footer navigation
    // =========================

    /** [EVENTS:btnBack] Indietro */
    btnBack.addEventListener("click", () => go(Math.max(1, step-1)));

    /** [EVENTS:btnNext] Continua / Invia */
    btnNext.addEventListener("click", () => {
      if (step === 1 && !validStep1()) return;
      if (step === 3 && !validStep3()) return;

      if (step < 4){
        unlock(step + 1);
        go(step + 1);
        return;
      }

      // step 4 -> invio
      sendRequest();
    });

    // =========================
    // [BOOT] Inizializzazione
    // =========================

    /** [BOOT] Render extra + set default + vai step 1 */
    renderExtras();
    setDefaults();
    setHeader();
    setProgress();
    updateMini();
    go(1);
  }

  // =========================
  // [BOOT] Avvio sicuro
  // =========================

  /** [BOOT:readyState] Se DOM non pronto, aspetta */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();