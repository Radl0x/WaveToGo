const items = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 100}ms`;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

items.forEach(item => observer.observe(item));



  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });


  

  /* =====================================================
   WaveToGo — WHY US (Premium Section)
   - IntersectionObserver (in-view)
   - Count-up (easeOutCubic)
   - Tabs (ARIA)
   - Steps reveal + progress rail
   - Lightbox gallery (vanilla)
   - prefers-reduced-motion respected
   - IIFE to avoid globals
   ===================================================== */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Smooth scroll helper
  function smoothScrollTo(targetSel) {
    const el = $(targetSel);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  // =====================================================
  // Count-up: easeOutCubic + decimals support
  // =====================================================
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el) {
    const raw = el.getAttribute("data-count");
    const decimals = Number(el.getAttribute("data-decimals") || "0");
    const end = Number(raw);
    if (!Number.isFinite(end)) return;

    const duration = reduceMotion ? 1 : 900;
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = easeOutCubic(p);
      const value = start + (end - start) * eased;

      el.textContent = value.toFixed(decimals);

      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = end.toFixed(decimals);
    }

    requestAnimationFrame(tick);
  }

  // =====================================================
  // Tabs: ARIA + ink indicator
  // =====================================================
  function initTabs(section) {
    const tabButtons = $$(".wtg-tab", section);
    const panels = $$(".wtg-panel", section);
    const ink = $(".wtg-tabs__ink", section);

    if (!tabButtons.length || !panels.length || !ink) return;

    function setInkTo(btn) {
      const idx = tabButtons.indexOf(btn);
      ink.style.transform = `translateX(${idx * 100}%)`;
    }

    function activateTab(btn) {
      tabButtons.forEach(b => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
        b.tabIndex = active ? 0 : -1;
      });

      const controls = btn.getAttribute("aria-controls");
      panels.forEach(p => p.classList.toggle("is-active", p.id === controls));
      setInkTo(btn);

      // Focus panel for accessibility (optional)
      const panel = $("#" + controls, section);
      if (panel) panel.focus({ preventScroll: true });
    }

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => activateTab(btn));
      btn.addEventListener("keydown", (e) => {
        const idx = tabButtons.indexOf(btn);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const nextIdx = e.key === "ArrowRight"
            ? (idx + 1) % tabButtons.length
            : (idx - 1 + tabButtons.length) % tabButtons.length;
          tabButtons[nextIdx].focus();
          activateTab(tabButtons[nextIdx]);
        }
      });
    });

    // initial ink position
    const initial = $(".wtg-tab.is-active", section) || tabButtons[0];
    setInkTo(initial);
  }

  // =====================================================
  // Steps reveal + progress rail
  // =====================================================
  function initSteps(section) {
    const steps = $$(".wtg-step2", section);
    const fill = $(".wtg-stepsWrap__fill", section);
    if (!steps.length || !fill) return;

    let revealed = 0;

    const revealOne = (idx) => {
      if (idx < 0 || idx >= steps.length) return;
      const step = steps[idx];
      if (step.classList.contains("is-in")) return;

      step.classList.add("is-in");
      revealed += 1;

      const pct = Math.round((revealed / steps.length) * 100);
      fill.style.width = `${pct}%`;
    };

    // If reduced motion, show all
    if (reduceMotion) {
      steps.forEach(s => s.classList.add("is-in"));
      fill.style.width = "100%";
      return;
    }

    // reveal sequentially on view (progressive feel)
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = steps.indexOf(entry.target);
        revealOne(idx);
      });
    }, { threshold: 0.22 });

    steps.forEach(s => obs.observe(s));
  }

 function initLightbox(section) {
  const items = Array.from(section.querySelectorAll(".wtg-gItem"));
  const lb = document.getElementById("wtgLightbox");
  if (!items.length || !lb) return;

  // ✅ IMPORTANT: sposta la lightbox direttamente sotto <body> (popup vero)
  if (lb.parentElement !== document.body) {
    document.body.appendChild(lb);
  }

  const img = lb.querySelector(".wtg-lightbox__img");
  const cap = lb.querySelector(".wtg-lightbox__cap");
  const prevBtn = lb.querySelector("[data-prev]");
  const nextBtn = lb.querySelector("[data-next]");
  const closeBtn = lb.querySelector(".wtg-lightbox__close");
  const box = lb.querySelector(".wtg-lightbox__box");

  let idx = 0;
  let lastFocus = null;

  // scroll lock senza “muovere” lo sfondo
  let scrollY = 0;
  function lockScroll() {
    scrollY = window.scrollY || 0;

    // evita shift scrollbar (desktop)
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    if (sbw > 0) document.body.style.paddingRight = sbw + "px";

    document.body.classList.add("wtg-lb-lock");
    document.body.style.top = `-${scrollY}px`;
  }

  function unlockScroll() {
    document.body.classList.remove("wtg-lb-lock");
    document.body.style.top = "";
    document.body.style.paddingRight = "";
    window.scrollTo(0, scrollY);
  }

  function openAt(i) {
    idx = (i + items.length) % items.length;
    const it = items[idx];
    const full = it.getAttribute("data-full");
    const title = it.getAttribute("data-title") || "";

    lastFocus = document.activeElement;

    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");

    img.src = full || "";
    img.alt = title;
    cap.textContent = title;

    lockScroll();
    closeBtn?.focus({ preventScroll: true });
  }

  function close() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    unlockScroll();
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function prev() { openAt(idx - 1); }
  function next() { openAt(idx + 1); }

  // open
  items.forEach((it, i) => it.addEventListener("click", () => openAt(i)));

  // close button
  closeBtn?.addEventListener("click", (e) => { e.stopPropagation(); close(); });

  // ✅ click fuori: se non clicchi dentro il box, chiude
  lb.addEventListener("click", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (box && !box.contains(e.target)) close();
  });

  // ✅ click dentro box NON chiude
  box?.addEventListener("click", (e) => e.stopPropagation());

  // nav
  prevBtn?.addEventListener("click", (e) => { e.stopPropagation(); prev(); });
  nextBtn?.addEventListener("click", (e) => { e.stopPropagation(); next(); });

  // keyboard
  window.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
}

  // =====================================================
  // Observer: in-view triggers (counts + trust animations)
  // =====================================================
  function initInView(rootSection) {
    const trust = $(".wtg-trustCenter", rootSection);
    const counters = $$(".wtg-count[data-count]", rootSection);

    const runCountsOnce = (() => {
      let done = false;
      return () => {
        if (done) return;
        done = true;
        counters.forEach(animateCount);
      };
    })();

    if (reduceMotion) {
      trust?.classList.add("is-inview");
      runCountsOnce();
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // trust shimmer + pulse
        if (entry.target === trust) trust.classList.add("is-inview");

        // counts (triggered once)
        runCountsOnce();
      });
    }, { threshold: 0.35 });

    if (trust) obs.observe(trust);
    // also observe whole section as fallback for counts
    obs.observe(rootSection);
  }

  // =====================================================
  // Scroll buttons inside cards (data-wtg-scroll)
  // =====================================================
  function initScrollButtons(rootSection) {
    const btns = $$("[data-wtg-scroll]", rootSection);
    btns.forEach(b => {
      b.addEventListener("click", () => {
        const target = b.getAttribute("data-wtg-scroll");
        if (target) smoothScrollTo(target);
      });
    });
  }

  // =====================================================
  // Boot
  // =====================================================
  const section = $("#wtgWhy");
  if (!section) return;

  initScrollButtons(section);
  initInView(section);

  const tabsSection = $(".wtg-tabs", section);
  if (tabsSection) initTabs(tabsSection);

  const stepsSection = $(".wtg-stepsWrap", section);
  if (stepsSection) initSteps(stepsSection);

  const gallerySection = $(".wtg-gallery", section);
  if (gallerySection) initLightbox(gallerySection);
})();