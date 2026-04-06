/* ══════════════════════════════════════════════════════
   VIZ DATA
   ── image: path relative to index.html (null = placeholder)
   ── Save your PNGs to assets/ with these exact filenames
═══════════════════════════════════════════════════════ */
const VIZ_DATA = [
  {
    image:    'assets/chart-case-types-year.png',
    cardIcon: 'TL',
    title:    'Case Types by Year (1701–1721)',
    shortTitle: 'Case Types by Year',
    category: 'timeline',
    tag:      'Timeline',
    tagClass: 'cat--timeline',
    thumbClass:'thumb--timeline',
    desc:     'Stacked bar chart showing the annual breakdown of Company Committee, State Court, and Unclear case types across all Committee of Lawsuit records. The dramatic spike in 1704 reflects a period of exceptional legal activity — the year the Company faced its heaviest documented caseload.',
    methods:  ['Temporal Analysis', 'Case Classification', 'Annotation'],
  },
  {
    image:    'assets/chart-state-shift.png',
    cardIcon: 'TL',
    title:    'Shift from Company Committee to State Courts Over Time',
    shortTitle: 'Company → State Courts Shift',
    category: 'timeline',
    tag:      'Timeline',
    tagClass: 'cat--timeline',
    thumbClass:'thumb--timeline',
    desc:     'Area chart tracing the relative volume of Company Committee vs. State Court legal actions from 1700 to 1721. The "Unclear" band captures actions where jurisdictional attribution remains ambiguous in the records, revealing the blurred boundary between corporate and state legal authority.',
    methods:  ['Timeline Analysis', 'Jurisdictional Coding', 'Longitudinal Comparison'],
  },
  {
    image:    'assets/chart-legal-authority.png',
    cardIcon: 'LT',
    title:    'Company vs State Legal Authority Over Time',
    shortTitle: 'Company vs State Authority',
    category: 'legal',
    tag:      'Legal Themes',
    tagClass: 'cat--legal',
    thumbClass:'thumb--legal',
    desc:     'Grouped bar chart comparing the annual volume of legal actions handled by the Company Committee, State Court, and unclear forums (1701–1721). The 1704 peak reveals an exceptional concentration of Company-internal dispute resolution, after which authority increasingly shifts towards State Courts.',
    methods:  ['Case Classification', 'Institutional Analysis', 'Longitudinal Comparison'],
  },
  {
    image:    'assets/chart-case-types.png',
    cardIcon: 'LT',
    title:    'Most Common Case Types in EIC Legal Records',
    shortTitle: 'Most Common Case Types',
    category: 'legal',
    tag:      'Legal Themes',
    tagClass: 'cat--legal',
    thumbClass:'thumb--legal',
    desc:     'Bar chart of the six most frequently occurring clause types across all 164 Committee of Lawsuit records. Committee Governance dominates with 220 mentions, followed by Legal Counsel Work (140) and Maritime Seizures & Ship Litigation (134) — confirming that ship-related disputes were among the most pressing legal concerns of the period.',
    methods:  ['Thematic Coding', 'Word Frequency', 'Case Classification'],
  },
  {
    image:    'assets/chart-lawyers.png',
    cardIcon: 'NW',
    title:    'Top Lawyers Appearing in EIC Records Over Time',
    shortTitle: 'Top Lawyers Over Time',
    category: 'network',
    tag:      'Networks',
    tagClass: 'cat--network',
    thumbClass:'thumb--network',
    desc:     'Line chart tracking the annual mention frequency of the five most prominent legal practitioners in the records — Mr Hungerford, Mr Rowe, Mr Coulson, Mr Dubois, and Mr Dodd — from 1700 to 1721. The synchronised peak around 1704 suggests a coordinated legal response to the Company\'s most active dispute period.',
    methods:  ['Named Entity Recognition', 'Network Analysis', 'Prosopography'],
  },
  {
    image:    null,
    cardIcon: 'LG',
    title:    'Word Frequency Analysis',
    shortTitle: 'Word Frequency',
    category: 'language',
    tag:      'Language',
    tagClass: 'cat--language',
    thumbClass:'thumb--language',
    desc:     'Word frequency and contextual co-occurrence analysis revealing the recurring legal terminology, most-cited parties, and dominant procedural language across all 164 records. Awaiting full corpus text extraction.',
    methods:  ['NLP', 'Word Frequency', 'Corpus Analysis'],
  },
  {
    image:    null,
    cardIcon: 'NW',
    title:    'Actor Network Graph',
    shortTitle: 'Actor Network Graph',
    category: 'network',
    tag:      'Networks',
    tagClass: 'cat--network',
    thumbClass:'thumb--network',
    desc:     'A force-directed network graph of all named individuals extracted from the records, connected by co-appearance in cases. Node size reflects centrality; clusters reveal factions and coalitions within the Company\'s legal apparatus. Awaiting full entity extraction.',
    methods:  ['Network Analysis', 'Entity Extraction', 'Prosopography'],
  },
  {
    image:    null,
    cardIcon: 'LG',
    title:    'Topic Model Output',
    shortTitle: 'Topic Model',
    category: 'language',
    tag:      'Language',
    tagClass: 'cat--language',
    thumbClass:'thumb--language',
    desc:     'Machine-learning topic model (LDA/NMF) revealing the underlying thematic structure of the corpus — grouping documents by dominant subject matter without manual labelling. Awaiting full corpus text extraction.',
    methods:  ['LDA', 'NMF', 'Topic Modelling'],
  },
];

/* ══════════════════════════════════════════════════════
   BUILD CAROUSEL CARDS FROM VIZ_DATA
═══════════════════════════════════════════════════════ */
function buildCarousel() {
  const carousel = document.getElementById('vizCarousel');
  if (!carousel) return;
  carousel.innerHTML = '';

  VIZ_DATA.forEach((d, i) => {
    const card = document.createElement('div');
    card.className = 'viz-doc-card';
    card.dataset.category = d.category;
    card.dataset.viz = i;

    // Thumbnail — real image or category monogram
    let thumbInner = '';
    if (d.image) {
      thumbInner = `<img class="viz-thumb-img" src="${d.image}" alt="${d.shortTitle}" />
                    <span class="has-chart-badge">Chart</span>`;
    } else {
      thumbInner = `<span class="cat-monogram" style="opacity:0.45;font-family:var(--font);font-size:1.7rem;font-style:italic;font-weight:600;letter-spacing:-0.04em;color:var(--text-sub)">${d.cardIcon}</span>`;
    }

    card.innerHTML = `
      <div class="viz-doc-thumb ${d.thumbClass}">${thumbInner}</div>
      <div class="viz-doc-meta">
        <span class="viz-cat-tag ${d.tagClass}">${d.tag}</span>
        <h4>${d.shortTitle}</h4>
      </div>`;

    card.addEventListener('click', () => {
      updateViewer(i);
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });

    carousel.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════
   VIEWER — UPDATE
═══════════════════════════════════════════════════════ */
let activeViz = 0;

function getVisibleCards() {
  return [...document.querySelectorAll('.viz-doc-card')].filter(c => !c.classList.contains('hidden'));
}

function updateViewer(idx) {
  const d = VIZ_DATA[idx];
  if (!d) return;
  activeViz = idx;

  // Highlight active card
  document.querySelectorAll('.viz-doc-card').forEach(c => {
    c.classList.toggle('active-card', parseInt(c.dataset.viz) === idx);
  });

  // Display area — real image or placeholder
  const display = document.getElementById('vizDisplay');
  if (d.image) {
    display.innerHTML = `
      <div class="viz-viewer-img-wrap">
        <img class="viz-chart-img" src="${d.image}" alt="${d.title}" />
      </div>`;
  } else {
    display.innerHTML = `
      <div class="viz-viewer-placeholder">
        <span class="ph-monogram">${d.cardIcon}</span>
        <span id="viewerTitle">${d.title}</span>
        <span id="viewerStatus">Awaiting data input — upload or embed your chart here</span>
      </div>`;
  }

  // Info panel
  document.getElementById('viewerHeading').textContent = d.title;
  document.getElementById('viewerDesc').textContent    = d.desc;

  const tagEl = document.getElementById('viewerTag');
  tagEl.textContent = d.tag;
  tagEl.className   = `viz-cat-tag ${d.tagClass}`;

  const methodsEl = document.getElementById('viewerMethods');
  methodsEl.innerHTML = d.methods.map(m => `<span>${m}</span>`).join('');

  // Counter
  const visible = getVisibleCards();
  const pos = visible.findIndex(c => parseInt(c.dataset.viz) === idx);
  document.getElementById('viewerCounter').textContent = `${pos + 1} / ${visible.length}`;
}

/* ══════════════════════════════════════════════════════
   VIEWER — PREV / NEXT
═══════════════════════════════════════════════════════ */
document.getElementById('viewerPrev').addEventListener('click', () => {
  const visible = getVisibleCards();
  const pos = visible.findIndex(c => parseInt(c.dataset.viz) === activeViz);
  if (pos > 0) {
    const prev = parseInt(visible[pos - 1].dataset.viz);
    updateViewer(prev);
    visible[pos - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
});

document.getElementById('viewerNext').addEventListener('click', () => {
  const visible = getVisibleCards();
  const pos = visible.findIndex(c => parseInt(c.dataset.viz) === activeViz);
  if (pos < visible.length - 1) {
    const next = parseInt(visible[pos + 1].dataset.viz);
    updateViewer(next);
    visible[pos + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
});

/* ══════════════════════════════════════════════════════
   TAB NAVIGATION
═══════════════════════════════════════════════════════ */
const allTabBtns   = document.querySelectorAll('.tab-btn');
const allTabPanels = document.querySelectorAll('.tab-panel');

function activateTab(tabId) {
  allTabBtns.forEach(btn => {
    const match = btn.dataset.tab === tabId;
    btn.classList.toggle('active', match);
    btn.setAttribute('aria-selected', match);
  });
  allTabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  mobileNav.classList.remove('open');

  // Progress bar: only visible on Research Questions tab
  const bar = document.getElementById('rqProgressBar');
  if (bar) {
    bar.classList.toggle('active', tabId === 'questions');
    if (tabId === 'questions') bar.style.width = '0%';
  }
}

allTabBtns.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));

document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    activateTab(el.dataset.goto);
  });
});

/* ══════════════════════════════════════════════════════
   MOBILE NAV
═══════════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));

/* ══════════════════════════════════════════════════════
   SCROLL CAROUSELS
═══════════════════════════════════════════════════════ */
document.querySelectorAll('.scroll-arrow-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const track = document.getElementById(btn.dataset.target);
    if (!track) return;
    const step = 260;
    if (btn.classList.contains('scroll-left'))  track.scrollLeft -= step;
    if (btn.classList.contains('scroll-right')) track.scrollLeft += step;
  });
});

/* ══════════════════════════════════════════════════════
   VIZ FILTER BAR
═══════════════════════════════════════════════════════ */
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.viz-doc-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });

    const visible = getVisibleCards();
    document.getElementById('vizCount').textContent =
      `${visible.length} visualization${visible.length !== 1 ? 's' : ''}`;

    if (visible.length > 0) updateViewer(parseInt(visible[0].dataset.viz));
  });
});

/* ══════════════════════════════════════════════════════
   ARTICLE TOC HIGHLIGHT
═══════════════════════════════════════════════════════ */
const tocLinks = document.querySelectorAll('.article-toc a');
const tocSections = [...tocLinks].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

window.addEventListener('scroll', () => {
  let current = '';
  tocSections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = '#' + sec.id;
  });
  tocLinks.forEach(link => {
    link.classList.toggle('toc-active', link.getAttribute('href') === current);
  });
}, { passive: true });

tocLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(link.getAttribute('href'));
    if (t) window.scrollTo({ top: t.offsetTop - 90, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════════════════
   SCROLL-REVEAL
═══════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.07 });

function attachReveal(selector, delay = 0) {
  document.querySelectorAll(selector).forEach((el, i) => {
    if (el.style.opacity === '1') return;
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${delay + i * 60}ms, transform 0.5s ease ${delay + i * 60}ms`;
    revealObs.observe(el);
  });
}

/* ══════════════════════════════════════════════════════
   LIGHT / DARK MODE TOGGLE
═══════════════════════════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('eic-theme', theme);
}

// Default to dark; restore saved preference only if user explicitly chose light
const savedTheme = localStorage.getItem('eic-theme');
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme;
  applyTheme(current === 'light' ? 'dark' : 'light');
});

/* ══════════════════════════════════════════════════════
   VIZ QUICKLINKS (Research Questions → Visualizations)
═══════════════════════════════════════════════════════ */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.viz-quicklink');
  if (!btn) return;
  const vizIdx = parseInt(btn.dataset.vizOpen);
  hideVizPopup();
  activateTab('visualizations');
  setTimeout(() => {
    updateViewer(vizIdx);
    const card = document.querySelector(`.viz-doc-card[data-viz="${vizIdx}"]`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    const viewer = document.getElementById('vizViewer');
    if (viewer) viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
});

/* ══════════════════════════════════════════════════════
   VIZ HOVER POPUP
   Shows a chart preview after hovering a quicklink for
   ~650 ms — long enough to be intentional.
═══════════════════════════════════════════════════════ */
const vizPopup        = document.getElementById('vizPopup');
const vizPopupImg     = document.getElementById('vizPopupImg');
const vizPopupPh      = document.getElementById('vizPopupPlaceholder');
const vizPopupMonogram= document.getElementById('vizPopupMonogram');
const vizPopupTag     = document.getElementById('vizPopupTag');
const vizPopupTitle   = document.getElementById('vizPopupTitle');

let popupTimer = null;

function showVizPopup(btn) {
  const idx = parseInt(btn.dataset.vizOpen);
  const d   = VIZ_DATA[idx];
  if (!d) return;

  /* Populate content */
  vizPopupTitle.textContent = d.shortTitle || d.title;
  vizPopupTag.textContent   = d.tag;
  vizPopupTag.className     = `viz-popup-tag ${d.tagClass}`;

  if (d.image) {
    vizPopupImg.src = d.image;
    vizPopupImg.alt = d.title;
    vizPopup.classList.add('has-image');
  } else {
    vizPopupMonogram.textContent = d.cardIcon;
    vizPopup.classList.remove('has-image');
  }

  /* Smart positioning: above the button if space, else below */
  const rect   = btn.getBoundingClientRect();
  const popW   = 340;
  const popH   = 260; // approx
  const margin = 10;

  let left = rect.left + rect.width / 2 - popW / 2;
  // clamp horizontally
  left = Math.max(margin, Math.min(left, window.innerWidth - popW - margin));

  let top;
  if (rect.top > popH + margin) {
    // place above
    top = rect.top - popH - 8;
  } else {
    // place below
    top = rect.bottom + 8;
  }

  vizPopup.style.left = `${left}px`;
  vizPopup.style.top  = `${top}px`;

  vizPopup.setAttribute('aria-hidden', 'false');
  vizPopup.classList.add('visible');
}

function hideVizPopup() {
  clearTimeout(popupTimer);
  vizPopup.classList.remove('visible');
  vizPopup.setAttribute('aria-hidden', 'true');
}

document.addEventListener('mouseover', (e) => {
  const btn = e.target.closest('.viz-quicklink');
  if (!btn) return;
  clearTimeout(popupTimer);
  popupTimer = setTimeout(() => showVizPopup(btn), 650);
});

document.addEventListener('mouseout', (e) => {
  const btn = e.target.closest('.viz-quicklink');
  if (!btn) return;
  /* Allow cursor to move into the popup itself without dismissing */
  const to = e.relatedTarget;
  if (to && vizPopup.contains(to)) return;
  clearTimeout(popupTimer);
  hideVizPopup();
});

vizPopup.addEventListener('mouseleave', hideVizPopup);

/* ══════════════════════════════════════════════════════
   HOME SCROLL REVEAL
   Sections slide up over the sticky hero as you scroll.
═══════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal-section').forEach(s => revealObserver.observe(s));

/* Hide scroll cue once user starts scrolling */
const heroScrollCue = document.getElementById('heroScrollCue');
if (heroScrollCue) {
  const hideCue = () => {
    if (window.scrollY > 40) heroScrollCue.classList.add('hidden');
    else heroScrollCue.classList.remove('hidden');
  };
  window.addEventListener('scroll', hideCue, { passive: true });
}

/* ══════════════════════════════════════════════════════
   FULLSCREEN LIGHTBOX
═══════════════════════════════════════════════════════ */
const vizLightbox    = document.getElementById('vizLightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxCaption= document.getElementById('lightboxCaption');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxCaption.textContent = alt || '';
  vizLightbox.classList.add('open');
  vizLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  vizLightbox.classList.remove('open');
  vizLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);

// Open lightbox when clicking a chart image in the viewer
document.getElementById('vizViewer').addEventListener('click', e => {
  const img = e.target.closest('.viz-chart-img');
  if (!img) return;
  const d = VIZ_DATA[activeViz];
  openLightbox(img.src, d ? d.title : img.alt);
});

/* ══════════════════════════════════════════════════════
   KEYBOARD NAVIGATION
   Escape: close lightbox  |  ← →: step viz carousel
═══════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (vizLightbox.classList.contains('open')) { closeLightbox(); return; }
    const cityPanel = document.getElementById('cityPanel');
    if (cityPanel && cityPanel.classList.contains('open')) {
      cityPanel.classList.remove('open');
      cityPanel.setAttribute('aria-hidden', 'true');
      window.dispatchEvent(new CustomEvent('eic-panel-close'));
    }
  }
  if (document.getElementById('tab-visualizations').classList.contains('active')) {
    if (e.key === 'ArrowLeft')  document.getElementById('viewerPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('viewerNext').click();
  }
});

/* ══════════════════════════════════════════════════════
   READING PROGRESS BAR
   Fills as user scrolls through Research Questions tab.
═══════════════════════════════════════════════════════ */
const rqProgressBar = document.getElementById('rqProgressBar');

function updateRQProgress() {
  if (!rqProgressBar || !rqProgressBar.classList.contains('active')) return;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  rqProgressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';
}

window.addEventListener('scroll', updateRQProgress, { passive: true });

/* ══════════════════════════════════════════════════════
   CITY INFO PANEL
   Receives clicks from three-scene.js via CustomEvent.
═══════════════════════════════════════════════════════ */
const cityPanel       = document.getElementById('cityPanel');
const cityPanelName   = document.getElementById('cityPanelName');
const cityPanelFounded= document.getElementById('cityPanelFounded');
const cityPanelRole   = document.getElementById('cityPanelRole');
const cityPanelRecords= document.getElementById('cityPanelRecords');

document.getElementById('cityPanelClose').addEventListener('click', () => {
  cityPanel.classList.remove('open');
  cityPanel.setAttribute('aria-hidden', 'true');
  window.dispatchEvent(new CustomEvent('eic-panel-close'));
});

window.addEventListener('eic-city-click', e => {
  const city = e.detail;
  cityPanelName.textContent    = city.name;
  cityPanelFounded.textContent = city.founded;
  cityPanelRole.textContent    = city.role;
  cityPanelRecords.textContent = city.records + ' mentions';

  const imgWrap   = document.getElementById('cityPanelImgWrap');
  const imgEl     = document.getElementById('cityPanelImg');
  const captionEl = document.getElementById('cityPanelImgCaption');
  if (city.img) {
    imgEl.src = city.img;
    imgEl.alt = city.imgCaption || city.name;
    captionEl.textContent = city.imgCaption || '';
    imgWrap.style.display = 'block';
    imgEl.onerror = () => { imgWrap.style.display = 'none'; };
  } else {
    imgWrap.style.display = 'none';
  }

  cityPanel.classList.add('open');
  cityPanel.setAttribute('aria-hidden', 'false');
});

/* ══════════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════════ */
const SEARCH_INDEX = [
  // Visualizations
  ...VIZ_DATA.map((d, i) => ({ tag: d.tag, title: d.title, desc: d.desc, action: () => { activateTab('visualizations'); setTimeout(() => updateViewer(i), 80); } })),
  // Research Questions
  { tag: 'Research Questions', title: 'RQ 1 — EIC as Legal Institution', desc: 'How the Committee of Lawsuit functioned within the English legal system.', action: () => activateTab('questions') },
  { tag: 'Research Questions', title: 'RQ 2 — Professional Networks', desc: 'Networks embedded within the lawsuit records and their influence on outcomes.', action: () => activateTab('questions') },
  { tag: 'Research Questions', title: 'RQ 3 — Corporate vs State Authority', desc: 'Where corporate governance ended and the external legal system began.', action: () => activateTab('questions') },
  { tag: 'Research Questions', title: 'RQ 4 — Legal Themes & Ship Seizures', desc: 'Recurring legal themes and what their patterns reveal about Company priorities.', action: () => activateTab('questions') },
  // Project sections
  { tag: 'Project', title: 'Background', desc: 'EIC chartered 1600 — Committee of Lawsuit overview.', action: () => { activateTab('description'); setTimeout(() => { const el = document.getElementById('bg'); if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' }); }, 80); } },
  { tag: 'Project', title: 'The Corpus: 164 Committee Notes', desc: 'Core dataset of 164 individual meeting records.', action: () => { activateTab('description'); setTimeout(() => { const el = document.getElementById('corpus'); if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' }); }, 80); } },
  { tag: 'Project', title: 'Methodology', desc: 'Mixed-methods: close reading, timeline reconstruction, NLP, network analysis.', action: () => { activateTab('description'); setTimeout(() => { const el = document.getElementById('method'); if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' }); }, 80); } },
  { tag: 'Project', title: 'Applications', desc: 'Legal history, economic history, corporate governance, digital humanities.', action: () => { activateTab('description'); setTimeout(() => { const el = document.getElementById('applications'); if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' }); }, 80); } },
  { tag: 'Project', title: 'Key Themes', desc: 'Ship seizures, dispute resolution, merchant networks, contract enforcement.', action: () => { activateTab('description'); setTimeout(() => { const el = document.getElementById('themes'); if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' }); }, 80); } },
];

const searchInput   = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function runSearch(q) {
  q = q.trim().toLowerCase();
  searchResults.innerHTML = '';
  if (!q) { searchResults.classList.remove('visible'); return; }

  const hits = SEARCH_INDEX.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q) ||
    item.tag.toLowerCase().includes(q)
  ).slice(0, 8);

  if (!hits.length) {
    searchResults.innerHTML = '<p class="search-no-results">No results found.</p>';
  } else {
    hits.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `<span class="search-result-tag">${item.tag}</span><span class="search-result-title">${item.title}</span>`;
      div.addEventListener('click', () => {
        item.action();
        searchInput.value = '';
        searchResults.classList.remove('visible');
      });
      searchResults.appendChild(div);
    });
  }
  searchResults.classList.add('visible');
}

searchInput.addEventListener('input', () => runSearch(searchInput.value));
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchInput.value = ''; searchResults.classList.remove('visible'); }
});
document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) searchResults.classList.remove('visible');
});

/* ══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
buildCarousel();
updateViewer(0);
attachReveal('.deliverable-item');
attachReveal('.topic-item');
attachReveal('.theme-doc-card');
attachReveal('.rq-row');
