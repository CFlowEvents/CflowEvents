(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  window.addEventListener('load', () => {
    const loader = $('.page-loader');
    if (loader) setTimeout(() => loader.classList.add('is-hidden'), 220);
  });

  const header = $('.site-header');
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const toggle = $('.menu-toggle');
  const nav = $('.site-nav');
  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }


  // Random Instagram showcase: uses public Instagram embed URLs, so no API key is needed.
  const instagramGrid = $('#instagramGrid');
  if (instagramGrid) {
    const instagramPosts = [
      { type: 'reel', code: 'DbIIGR7tuPK', label: 'C Flow event reel' },
      { type: 'reel', code: 'DbDk9H9obLY', label: 'C Flow event reel' },
      { type: 'reel', code: 'Dclo5XroqZK', label: 'C Flow event reel' },
      { type: 'reel', code: 'DZCgbKsMBst', label: 'C Flow event reel' },
      { type: 'reel', code: 'DNEC5baIgMW', label: 'C Flow event reel' },
      { type: 'post', code: 'DLug4WYsS6a', label: 'C Flow event post' },
      { type: 'reel', code: 'DQ9cFxkCDp-', label: 'C Flow event reel' }
    ];

    const shuffled = [...instagramPosts].sort(() => Math.random() - 0.5).slice(0, 3);
    shuffled.forEach((item, idx) => {
      const card = document.createElement('article');
      card.className = 'instagram-card reveal visible';

      const iframe = document.createElement('iframe');
      const path = item.type === 'post' ? 'p' : 'reel';
      iframe.src = `https://www.instagram.com/${path}/${item.code}/embed/`;
      iframe.title = `${item.label} ${idx + 1}`;
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');

      card.appendChild(iframe);
      instagramGrid.appendChild(card);
    });
  }

  // Randomly choose between the two C Flow trailers for both video placements.
  const trailerChoices = ['assets/cflow-trailer.mp4', 'assets/cflow-trailer2.mp4'];
  const setRandomVideo = (video, source) => {
    if (!video || !source) return;
    const selectedTrailer = trailerChoices[Math.floor(Math.random() * trailerChoices.length)];
    source.src = selectedTrailer;
    video.load();
    video.play().catch(() => {});
  };

  const heroVideo = $('#hero-video');
  const heroVideoSource = $('#hero-video-source');
  setRandomVideo(heroVideo, heroVideoSource);

  const brandVideo = $('#brand-video');
  const brandVideoSource = $('#brand-video-source');
  setRandomVideo(brandVideo, brandVideoSource);

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const soundToggle = $('.sound-toggle');
  if (brandVideo && soundToggle) {
    soundToggle.addEventListener('click', () => {
      brandVideo.muted = !brandVideo.muted;
      soundToggle.textContent = brandVideo.muted ? 'Sound on' : 'Sound off';
      soundToggle.setAttribute('aria-label', brandVideo.muted ? 'Turn video sound on' : 'Turn video sound off');
    });
  }

  const form = $('#meetingForm');
  if (!form) return;

  const phoneInput = $('#phone');
  let iti = null;
  if (phoneInput && window.intlTelInput) {
    iti = window.intlTelInput(phoneInput, {
      initialCountry: 'lb',
      separateDialCode: true,
      preferredCountries: ['lb', 'ae', 'fr', 'us', 'gb'],
      nationalMode: false,
      autoPlaceholder: 'aggressive',
      utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js'
    });
  }

  const noBudget = $('#budgetNoSpecific');
  const budgetRange = $('.budget-range');
  const syncBudget = () => {
    if (!noBudget || !budgetRange) return;
    budgetRange.style.display = noBudget.checked ? 'none' : 'grid';
    ['#budgetMin', '#budgetMax'].forEach(id => {
      const input = $(id);
      if (input) input.required = !noBudget.checked;
    });
  };
  noBudget?.addEventListener('change', syncBudget);
  syncBudget();

  const eventDate = $('#eventDate');
  if (eventDate) {
    const today = new Date();
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    eventDate.min = localToday;
  }

  const popup = $('#popupOverlay');
  const closePopup = () => {
    popup?.classList.remove('show');
    popup?.setAttribute('aria-hidden', 'true');
  };
  $('.popup-close')?.addEventListener('click', closePopup);
  popup?.addEventListener('click', e => { if (e.target === popup) closePopup(); });

  if (window.emailjs) {
    emailjs.init('byCf4TPG5UL7yT0JT');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submit = $('#submitButton');
    const status = $('#formStatus');
    const budgetMin = $('#budgetMin');
    const budgetMax = $('#budgetMax');

    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) status.textContent = 'Please complete the required fields.';
      return;
    }
    if (iti && !iti.isValidNumber()) {
      if (status) status.textContent = 'Please enter a valid phone number.';
      phoneInput.focus();
      return;
    }
    if (!noBudget?.checked && budgetMin && budgetMax && Number(budgetMin.value) > Number(budgetMax.value)) {
      if (status) status.textContent = 'Maximum budget must be greater than the minimum.';
      budgetMax.focus();
      return;
    }

    const data = new FormData(form);
    const payload = {
      to_email: 'cflow.event@gmail.com',
      name: data.get('name'),
      phone: iti ? iti.getNumber() : data.get('phone'),
      eventType: data.get('eventType'),
      eventDate: data.get('eventDate'),
      guests: data.get('guests'),
      budgetNoSpecific: noBudget?.checked ? 'Yes' : 'No',
      budgetMin: noBudget?.checked ? 'N/A' : data.get('budgetMin'),
      budgetMax: noBudget?.checked ? 'N/A' : data.get('budgetMax'),
      needLocation: data.get('needLocation') ? 'Yes' : 'No',
      area: data.get('area') || 'N/A',
      message: data.get('message') || 'N/A'
    };

    if (submit) { submit.disabled = true; submit.querySelector('span').textContent = 'Sending…'; }
    if (status) status.textContent = '';

    try {
      if (!window.emailjs) throw new Error('Email service did not load');
      await emailjs.send('service_l10gqs8', 'template_f0z1wbt', payload);
      form.reset();
      iti?.setNumber('');
      syncBudget();
      popup?.classList.add('show');
      popup?.setAttribute('aria-hidden', 'false');
    } catch (err) {
      console.error(err);
      if (status) status.textContent = 'Your request could not be sent. Please try again or contact us on WhatsApp.';
    } finally {
      if (submit) { submit.disabled = false; submit.querySelector('span').textContent = 'Send my inquiry'; }
    }
  });
})();
