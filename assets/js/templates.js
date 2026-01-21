document.addEventListener("click", e => {

  const tabBtn = e.target.closest(".tab-btn");
  if (tabBtn) {
    const tab = tabBtn.dataset.tab;

    document.querySelectorAll(".tab-btn")
      .forEach(b => b.classList.remove("active"));

    document.querySelectorAll(".tab-content")
      .forEach(c => c.classList.remove("active"));

    tabBtn.classList.add("active");
    document.getElementById("tab-" + tab).classList.add("active");
  }

  if (e.target.id === "heroPrenota") {
    document.querySelector("[data-nav='prenota']")?.click();
  }
});


