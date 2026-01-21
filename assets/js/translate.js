const switcher = document.getElementById('langSwitcher');
const currentLang = document.getElementById('currentLang');
const buttons = document.querySelectorAll('.lang-dropdown button');

const translations = {
  it: {
    meta: {
      title: 'WaveToGo – Noleggio Gommoni Golfo Aranci',
      description:
        'Noleggio gommoni premium senza patente a Golfo Aranci. Scopri Tavolara e Molara in libertà.',
    },
    hero: {
      badge: 'Marina di Golfo Aranci',
      title: {
        line1: 'Scopri la',
        line2: 'SARDEGNA',
        line3: 'dal mare',
        line4: 'in libertà',
      },
      subtitle:
        'Non noleggiamo gommoni. <br>' +
        'Regaliamo il momento in cui spegni il telefono,' +
        ' guardi il mare e capisci che stai vivendo davvero.<br>' +
        'Calette segrete, acqua cristallina,' +
        ' ricordi che restano quando l’estate finisce.<br><br>',
      cta: {
        primary: 'Prenota ora',
        secondary: 'Itinerari',
      },
    },
    trust: {
      item1: { title: 'Senza Patente', text: 'Adatto a tutti' },
      item2: { title: 'Fun Pack', text: 'Giochi gonfiabili' },
      item3: { title: 'Full immersion', text: 'Set snorkeling' },
      item4: { title: 'Social Ready', text: 'Noleggio GoPro' },
      item5: { title: 'Safe Sea', text: 'GPS satellitare' },
      item6: { title: 'Cancellazione', text: 'entro le 48h' },
    },
    footer: {
      location: 'Golfo Aranci',
      brand: {
        text: 'Esperienze nautiche premium, prenotazioni rapide e assistenza dedicata.',
      },
      sections: { label: 'Sezioni' },
      tabs: { services: 'Servizi', support: 'Supporto', contacts: 'Contatti' },
      services: {
        item1: 'Noleggio barche',
        item2: 'Tour privati',
        item3: 'Eventi aziendali',
        item4: 'Gift card',
      },
      support: {
        item1: 'FAQ',
        item2: 'Assistenza clienti',
        item3: 'Termini & condizioni',
        item4: 'Privacy policy',
      },
      contacts: {
        item1: 'Via del Porto 24, Napoli',
        item2: '+39 081 123 4567',
        item3: 'support@wavetogo.it',
        item4: 'Lun–Sab 09:00–19:00',
      },
      newsletter: {
        label: 'Newsletter',
        title: 'Resta aggiornato',
        text: 'Offerte esclusive, nuove rotte e promozioni private.',
        placeholder: 'La tua email',
        button: 'Iscriviti',
        note: 'Puoi disiscriverti quando vuoi.',
      },
      bottom: {
        copy: '© 2026 WaveToGo. Tutti i diritti riservati.',
        cookie: 'Cookie',
        security: 'Sicurezza',
        accessibility: 'Accessibilità',
      },
    },
  },

  en: {
    meta: {
      title: 'WaveToGo – Dinghy Rental Golfo Aranci',
      description:
        'Premium dinghy rental without license in Golfo Aranci. Discover Tavolara and Molara freely.',
    },
    hero: {
      badge: 'Marina di Golfo Aranci',
      title: {
        line1: 'Discover',
        line2: 'SARDINIA',
        line3: 'from the sea',
        line4: 'in freedom',
      },
      subtitle:
        'We don’t rent dinghies. <br>' +
        'We give you the moment you turn off your phone,' +
        ' look at the sea and realize you’re truly living.<br>' +
        'Secret coves, crystal water,' +
        ' memories that stay when summer ends.<br><br>',
      cta: {
        primary: 'Book now',
        secondary: 'Itineraries',
      },
    },
    trust: {
      item1: { title: 'No License', text: 'For everyone' },
      item2: { title: 'Fun Pack', text: 'Inflatable games' },
      item3: { title: 'Full immersion', text: 'Snorkeling kit' },
      item4: { title: 'Social Ready', text: 'GoPro rental' },
      item5: { title: 'Safe Sea', text: 'Satellite GPS' },
      item6: { title: 'Cancellation', text: 'within 48h' },
    },
    footer: {
      location: 'Golfo Aranci',
      brand: {
        text: 'Premium nautical experiences, fast bookings and dedicated support.',
      },
      sections: { label: 'Sections' },
      tabs: { services: 'Services', support: 'Support', contacts: 'Contacts' },
      services: {
        item1: 'Boat rental',
        item2: 'Private tours',
        item3: 'Corporate events',
        item4: 'Gift card',
      },
      support: {
        item1: 'FAQ',
        item2: 'Customer support',
        item3: 'Terms & conditions',
        item4: 'Privacy policy',
      },
      contacts: {
        item1: 'Via del Porto 24, Naples',
        item2: '+39 081 123 4567',
        item3: 'support@wavetogo.it',
        item4: 'Mon–Sat 09:00–19:00',
      },
      newsletter: {
        label: 'Newsletter',
        title: 'Stay updated',
        text: 'Exclusive offers, new routes and private promotions.',
        placeholder: 'Your email',
        button: 'Subscribe',
        note: 'You can unsubscribe anytime.',
      },
      bottom: {
        copy: '© 2026 WaveToGo. All rights reserved.',
        cookie: 'Cookie',
        security: 'Security',
        accessibility: 'Accessibility',
      },
    },
  },

  fr: {
    meta: {
      title: 'WaveToGo – Location de semi-rigides à Golfo Aranci',
      description:
        'Location premium de semi-rigides sans permis à Golfo Aranci. Découvrez Tavolara et Molara en liberté.',
    },
    hero: {
      badge: 'Marina di Golfo Aranci',
      title: {
        line1: 'Découvrez',
        line2: 'LA SARDAIGNE',
        line3: 'depuis la mer',
        line4: 'en liberté',
      },
      subtitle:
        'Nous ne louons pas des bateaux. <br>' +
        'Nous vous offrons le moment où vous éteignez votre téléphone,' +
        ' regardez la mer et comprenez que vous vivez vraiment.<br>' +
        'Criques secrètes, eau cristalline,' +
        ' souvenirs qui restent quand l’été finit.<br><br>',
      cta: {
        primary: 'Réserver',
        secondary: 'Itinéraires',
      },
    },
    trust: {
      item1: { title: 'Sans permis', text: 'Pour tous' },
      item2: { title: 'Fun Pack', text: 'Jeux gonflables' },
      item3: { title: 'Immersion totale', text: 'Kit snorkeling' },
      item4: { title: 'Social Ready', text: 'Location GoPro' },
      item5: { title: 'Mer sûre', text: 'GPS satellite' },
      item6: { title: 'Annulation', text: 'sous 48h' },
    },
    footer: {
      location: 'Golfo Aranci',
      brand: {
        text: 'Expériences nautiques premium, réservations rapides et assistance dédiée.',
      },
      sections: { label: 'Sections' },
      tabs: { services: 'Services', support: 'Support', contacts: 'Contacts' },
      services: {
        item1: 'Location de bateaux',
        item2: 'Tours privés',
        item3: 'Événements d’entreprise',
        item4: 'Carte cadeau',
      },
      support: {
        item1: 'FAQ',
        item2: 'Service client',
        item3: 'Termes & conditions',
        item4: 'Politique de confidentialité',
      },
      contacts: {
        item1: 'Via del Porto 24, Naples',
        item2: '+39 081 123 4567',
        item3: 'support@wavetogo.it',
        item4: 'Lun–Sam 09:00–19:00',
      },
      newsletter: {
        label: 'Newsletter',
        title: 'Restez informé',
        text: 'Offres exclusives, nouvelles routes et promotions privées.',
        placeholder: 'Votre e-mail',
        button: 'S’inscrire',
        note: 'Vous pouvez vous désinscrire à tout moment.',
      },
      bottom: {
        copy: '© 2026 WaveToGo. Tous droits réservés.',
        cookie: 'Cookie',
        security: 'Sécurité',
        accessibility: 'Accessibilité',
      },
    },
  },

  de: {
    meta: {
      title: 'WaveToGo – Schlauchbootverleih Golfo Aranci',
      description:
        'Premium-Schlauchbootverleih ohne Führerschein in Golfo Aranci. Entdecken Sie Tavolara und Molara frei.',
    },
    hero: {
      badge: 'Marina di Golfo Aranci',
      title: {
        line1: 'Entdecke',
        line2: 'SARDINIEN',
        line3: 'vom Meer',
        line4: 'in Freiheit',
      },
      subtitle:
        'Wir vermieten keine Boote. <br>' +
        'Wir schenken dir den Moment, in dem du dein Handy ausschaltest,' +
        ' aufs Meer blickst und merkst, dass du wirklich lebst.<br>' +
        'Geheime Buchten, kristallklares Wasser,' +
        ' Erinnerungen, die bleiben, wenn der Sommer endet.<br><br>',
      cta: {
        primary: 'Jetzt buchen',
        secondary: 'Routen',
      },
    },
    trust: {
      item1: { title: 'Ohne Führerschein', text: 'Für alle geeignet' },
      item2: { title: 'Fun Pack', text: 'Aufblasbare Spiele' },
      item3: { title: 'Full immersion', text: 'Schnorchel-Set' },
      item4: { title: 'Social Ready', text: 'GoPro-Verleih' },
      item5: { title: 'Safe Sea', text: 'Satelliten-GPS' },
      item6: { title: 'Stornierung', text: 'innerhalb 48h' },
    },
    footer: {
      location: 'Golfo Aranci',
      brand: {
        text: 'Premium-Seeerlebnisse, schnelle Buchungen und persönlicher Support.',
      },
      sections: { label: 'Bereiche' },
      tabs: { services: 'Services', support: 'Support', contacts: 'Kontakte' },
      services: {
        item1: 'Bootsverleih',
        item2: 'Private Touren',
        item3: 'Firmenveranstaltungen',
        item4: 'Geschenkkarte',
      },
      support: {
        item1: 'FAQ',
        item2: 'Kundendienst',
        item3: 'AGB',
        item4: 'Datenschutz',
      },
      contacts: {
        item1: 'Via del Porto 24, Neapel',
        item2: '+39 081 123 4567',
        item3: 'support@wavetogo.it',
        item4: 'Mo–Sa 09:00–19:00',
      },
      newsletter: {
        label: 'Newsletter',
        title: 'Bleib informiert',
        text: 'Exklusive Angebote, neue Routen und private Aktionen.',
        placeholder: 'Deine E-Mail',
        button: 'Anmelden',
        note: 'Du kannst dich jederzeit abmelden.',
      },
      bottom: {
        copy: '© 2026 WaveToGo. Alle Rechte vorbehalten.',
        cookie: 'Cookie',
        security: 'Sicherheit',
        accessibility: 'Barrierefreiheit',
      },
    },
  },
};

function updateDropdown(selectedLang) {
  buttons.forEach(btn => {
    btn.style.display = btn.dataset.lang === selectedLang ? 'none' : '';
  });
}

function setLanguage(lang) {
  const dict = translations[lang] || translations.it;

  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = key.split('.').reduce((o, i) => (o ? o[i] : null), dict);
    if (value !== null && value !== undefined) {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const value = key.split('.').reduce((o, i) => (o ? o[i] : null), dict);
    if (value !== null && value !== undefined) {
      el.innerHTML = value;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = key.split('.').reduce((o, i) => (o ? o[i] : null), dict);
    if (value !== null && value !== undefined) {
      el.setAttribute('placeholder', value);
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const value = key.split('.').reduce((o, i) => (o ? o[i] : null), dict);
    if (value !== null && value !== undefined && attr) {
      el.setAttribute(attr, value);
    }
  });

  localStorage.setItem('lang', lang);
}

currentLang.addEventListener('click', () => {
  switcher.classList.toggle('open');
});

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang.innerHTML = btn.querySelector('svg').outerHTML;
    currentLang.dataset.lang = btn.dataset.lang;
    switcher.classList.remove('open');
    updateDropdown(btn.dataset.lang);
    setLanguage(btn.dataset.lang);
  });
});

// inizializza: nasconde la lingua mostrata all’apertura
updateDropdown(currentLang.dataset.lang);

// carica lingua salvata o fallback IT
const savedLang = localStorage.getItem('lang') || currentLang.dataset.lang || 'it';
if (savedLang !== currentLang.dataset.lang) {
  const savedButton = [...buttons].find(b => b.dataset.lang === savedLang);
  if (savedButton) {
    currentLang.innerHTML = savedButton.querySelector('svg').outerHTML;
    currentLang.dataset.lang = savedLang;
  }
}
setLanguage(savedLang);