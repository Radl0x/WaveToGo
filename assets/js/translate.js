const switcher = document.getElementById('langSwitcher');
const currentLang = document.getElementById('currentLang');

currentLang.addEventListener('click', () => {
  switcher.classList.toggle('open');
});

document.querySelectorAll('.lang-dropdown button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang.innerHTML = btn.querySelector('svg').outerHTML;
    currentLang.dataset.lang = btn.dataset.lang;
    switcher.classList.remove('open');

    // qui poi agganci la traduzione vera
    // setLanguage(btn.dataset.lang)
  });
});
