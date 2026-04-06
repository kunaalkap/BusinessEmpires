/* ═══════════════════════════════════════════════════════════
   three-scene.js
   Animated 3-D wireframe India with EIC trade-route arcs.
   City dots pulse; arcs of light travel between trading posts.
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function init() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || !window.THREE) return;

    /* ── Renderer ──────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* ── Scene & Camera ────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(-0.6, 0.1, 6.6);
    camera.lookAt(0, 0.1, 0);

    /* ── Base materials ────────────────────────────────────── */
    const matEdge = new THREE.LineBasicMaterial({ color: 0xb8892a, transparent: true, opacity: 0.55 });
    const matGrid = new THREE.LineBasicMaterial({ color: 0x7a5c18, transparent: true, opacity: 0.18 });
    const matFill = new THREE.MeshBasicMaterial({ color: 0xb8892a, transparent: true, opacity: 0.04, side: THREE.DoubleSide });

    /* ═════════════════════════════════════════════════════════
       INDIA OUTLINE
       x = (lon − 82.5) × 0.138,  y = (lat − 21.5) × 0.138
    ═════════════════════════════════════════════════════════ */
    const OUTLINE = [
      [-1.17, 1.66], [-0.72, 1.80], [-0.41, 1.93], [-0.14, 1.72],
      [ 0.07, 0.90], [ 0.83, 0.90], [ 1.24, 0.76], [ 2.00, 0.97],
      [ 1.79, 0.48], [ 1.52, 0.28], [ 1.31, 0.14], [ 0.90, 0.07],
      [ 0.76, 0.00], [ 0.62,-0.14], [ 0.55,-0.28], [ 0.28,-0.48],
      [ 0.00,-0.69], [-0.28,-1.03], [-0.34,-1.24], [-0.41,-1.45],
      [-0.62,-1.72], [-0.69,-1.84], [-0.83,-1.65], [-0.97,-1.38],
      [-1.10,-1.10], [-1.21,-0.83], [-1.28,-0.55], [-1.32,-0.28],
      [-1.34,-0.07], [-1.52, 0.07], [-1.66, 0.14], [-1.86, 0.21],
      [-1.97, 0.28], [-1.93, 0.55], [-1.66, 0.83], [-1.45, 1.10],
      [-1.24, 1.38],
    ];

    const shape  = new THREE.Shape(OUTLINE.map(p => new THREE.Vector2(p[0], p[1])));
    const extGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.32, bevelEnabled: false });

    const fillMesh = new THREE.Mesh(extGeo, matFill);
    fillMesh.position.z = -0.16;
    const edgeMesh = new THREE.LineSegments(new THREE.EdgesGeometry(extGeo), matEdge);
    edgeMesh.position.z = -0.16;

    /* Interior cartographic lines */
    const Z_FRONT = 0.17;
    function gridLine(pts) {
      const geo = new THREE.BufferGeometry().setFromPoints(
        pts.map(p => new THREE.Vector3(p[0], p[1], Z_FRONT))
      );
      return new THREE.Line(geo, matGrid);
    }

    const root = new THREE.Group();
    root.add(fillMesh, edgeMesh);
    [
      [[-1.80, 0.28], [ 1.20, 0.28]],
      [[-1.30,-0.21], [ 0.65,-0.21]],
      [[-1.10,-0.90], [ 0.00,-0.90]],
      [[-0.65,-1.60], [-0.45,-1.60]],
      [[-0.35,-1.30], [-0.35, 1.10]],
      [[-1.04,-1.35], [-1.04, 0.85]],
      [[ 0.55,-0.55], [ 0.55, 0.95]],
    ].forEach(pts => root.add(gridLine(pts)));

    scene.add(root);

    /* ═════════════════════════════════════════════════════════
       EIC CITY HOTSPOTS
       Historical trading posts & factories, c. 1600–1800
    ═════════════════════════════════════════════════════════ */
    const Z_DOT = 0.22;   // just above front face

    const CITIES = [
      { name: 'Surat',        x: -1.34, y: -0.04,
        founded: '1608', records: 34,
        role: 'First EIC factory in India; gateway for Mughal trade in Gujarat.',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Surat_factories_of_trading_nations.jpg/640px-Surat_factories_of_trading_nations.jpg',
        imgCaption: 'European trading factories at Surat, c. 1680' },
      { name: 'Bombay',       x: -1.34, y: -0.34,
        founded: '1668', records: 28,
        role: "Acquired via Charles II's dowry; replaced Surat as the Company's western headquarters.",
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Bombay_in_1665.jpg/640px-Bombay_in_1665.jpg',
        imgCaption: 'View of Bombay harbour, 1665' },
      { name: 'Madras',       x: -0.30, y: -1.16,
        founded: '1639', records: 41,
        role: 'Fort St George — first EIC fortification; principal hub for Coromandel coast trade.',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fort_st_george.jpg/640px-Fort_st_george.jpg',
        imgCaption: 'Fort St George, Madras, c. 1754' },
      { name: 'Calcutta',     x:  0.82, y:  0.15,
        founded: '1690', records: 52,
        role: "Fort William — Bengal's commercial capital; became the seat of EIC governance after 1772.",
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/View_of_Fort_William%2C_Calcutta%2C_1735.jpg/640px-View_of_Fort_William%2C_Calcutta%2C_1735.jpg',
        imgCaption: 'Fort William, Calcutta, 1735' },
      { name: 'Cochin',       x: -0.85, y: -1.59,
        founded: '1635', records: 12,
        role: 'South-west pepper and spice post; long rivalry with the Portuguese-held town.',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Fort_Cochin_in_Kerala_1.jpg/640px-Fort_Cochin_in_Kerala_1.jpg',
        imgCaption: 'Fort Cochin, Kerala — historic waterfront' },
      { name: 'Masulipatnam', x: -0.19, y: -0.73,
        founded: '1611', records: 19,
        role: 'First Coromandel factory; centre of cotton textile and indigo exports.',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Kalamkari_EIC.jpg/640px-Kalamkari_EIC.jpg',
        imgCaption: 'Kalamkari textile — Masulipatnam trade goods, 17th c.' },
      { name: 'Patna',        x:  0.36, y:  0.56,
        founded: '1620', records: 22,
        role: 'Inland Ganges factory; critical node for saltpetre, opium, and Bengal silk.',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Patna_City_1814.jpg/640px-Patna_City_1814.jpg',
        imgCaption: 'Patna city from the Ganges, 1814' },
    ];

    /* City dot + glow ring materials (cloned per city for per-opacity animation) */
    CITIES.forEach((city, i) => {
      city.phase = (i / CITIES.length) * Math.PI * 2;

      /* Core dot */
      city.dotMat  = new THREE.MeshBasicMaterial({ color: 0xffd078, transparent: true, opacity: 0.95 });
      city.dot     = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 8), city.dotMat);
      city.dot.position.set(city.x, city.y, Z_DOT);

      /* Outer glow halo (slightly larger, low opacity) */
      city.glowMat = new THREE.MeshBasicMaterial({ color: 0xb8892a, transparent: true, opacity: 0.12, side: THREE.FrontSide });
      city.glow    = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), city.glowMat);
      city.glow.position.set(city.x, city.y, Z_DOT);

      /* Invisible hit-sphere for raycasting (larger target = easier to click) */
      city.hitMat = new THREE.MeshBasicMaterial({ visible: false });
      city.hit    = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), city.hitMat);
      city.hit.position.set(city.x, city.y, Z_DOT);
      city.hit.userData.cityIndex = i;

      root.add(city.glow, city.dot, city.hit);
    });

    /* ── City dot raycasting ────────────────────────────── */
    const raycaster   = new THREE.Raycaster();
    const mouse2d     = new THREE.Vector2();
    const hitMeshes   = CITIES.map(c => c.hit);
    let   arcsPaused  = false;

    const heroEl = canvas.closest('.hero') || canvas.parentElement;
    heroEl.addEventListener('click', e => {
      /* Don't intercept button / link clicks */
      if (e.target.closest('a, button')) return;

      const rect = canvas.getBoundingClientRect();
      mouse2d.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2d.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse2d, camera);
      const hits = raycaster.intersectObjects(hitMeshes);
      if (hits.length === 0) return;

      const idx  = hits[0].object.userData.cityIndex;
      const city = CITIES[idx];
      arcsPaused = true;

      window.dispatchEvent(new CustomEvent('eic-city-click', {
        detail: {
          name:       city.name,
          founded:    city.founded,
          role:       city.role,
          records:    city.records,
          img:        city.img        || null,
          imgCaption: city.imgCaption || null,
        }
      }));
    });

    /* Cursor hint: pointer when hovering a city */
    heroEl.addEventListener('mousemove', e => {
      if (e.target.closest('a, button')) { heroEl.style.cursor = ''; return; }
      const rect = canvas.getBoundingClientRect();
      mouse2d.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2d.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse2d, camera);
      const hits = raycaster.intersectObjects(hitMeshes);
      heroEl.style.cursor = hits.length > 0 ? 'pointer' : '';
    });

    window.addEventListener('eic-panel-close', () => { arcsPaused = false; });

    /* ═════════════════════════════════════════════════════════
       TRADE ROUTE ARCS
       Pairs of city indices — historically significant routes
    ═════════════════════════════════════════════════════════ */
    const ROUTES = [
      [0, 3],   // Surat      → Calcutta   (main east-west corridor)
      [1, 2],   // Bombay     → Madras     (south peninsular arc)
      [2, 3],   // Madras     → Calcutta   (east coast)
      [4, 2],   // Cochin     → Madras     (SW to SE coast)
      [0, 1],   // Surat      → Bombay     (Gujarat coast hop)
      [5, 2],   // Masulipatnam → Madras   (Coromandel coast)
      [3, 6],   // Calcutta   → Patna      (Ganges inland route)
      [1, 3],   // Bombay     → Calcutta   (long diagonal)
      [2, 6],   // Madras     → Patna      (cross-peninsula inland)
      [4, 1],   // Cochin     → Bombay     (west coast)
    ];

    const N_ARC_PTS = 64;

    /* Build arc objects */
    const arcs = ROUTES.map(([ai, bi]) => {
      const a = CITIES[ai], b = CITIES[bi];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const arcH = 0.45 + dist * 0.5;   // taller arc for longer routes

      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(a.x, a.y, Z_DOT),
        new THREE.Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, arcH),
        new THREE.Vector3(b.x, b.y, Z_DOT)
      );

      const pts = curve.getPoints(N_ARC_PTS);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geo.setDrawRange(0, 0);

      const lineMat = new THREE.LineBasicMaterial({ color: 0xd4a84c, transparent: true, opacity: 0 });
      const line    = new THREE.Line(geo, lineMat);

      /* Travelling "spark" at the arc head */
      const headMat  = new THREE.MeshBasicMaterial({ color: 0xfffbe6, transparent: true, opacity: 0 });
      const head     = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), headMat);

      /* Bright inner core of the spark */
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
      const core    = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), coreMat);
      head.add(core);

      head.visible = false;   // hide until arc starts drawing
      root.add(line, head);

      return {
        curve, geo, line, lineMat, head, headMat, coreMat,
        progress: 0,
        state:    'idle',
        cooldown: 0.5 + Math.random() * 4.0,   // stagger initial fire
      };
    });

    /* ── Arc update (delta-time driven) ────────────────────── */
    const MAX_CONCURRENT = 3;
    const ARC_SPEED      = 0.30;   // full arc in ~3.3 s

    function updateArcs(dt) {
      if (arcsPaused) return;   // paused while city panel is open
      const active = arcs.filter(a => a.state !== 'idle').length;

      arcs.forEach(arc => {
        if (arc.state === 'idle') {
          arc.cooldown -= dt;
          if (arc.cooldown <= 0 && active < MAX_CONCURRENT) {
            arc.state    = 'drawing';
            arc.progress = 0;
            arc.cooldown = 0;
            arc.head.visible = true;
          }
          return;
        }

        if (arc.state === 'drawing') {
          arc.progress = Math.min(arc.progress + dt * ARC_SPEED, 1);

          /* Reveal line up to current progress */
          arc.geo.setDrawRange(0, Math.floor(arc.progress * N_ARC_PTS) + 1);

          /* Move spark to current point */
          const pos = arc.curve.getPoint(arc.progress);
          arc.head.position.copy(pos);

          /* Fade in */
          arc.lineMat.opacity  = Math.min(arc.lineMat.opacity  + dt * 3.0, 0.55);
          arc.headMat.opacity  = Math.min(arc.headMat.opacity  + dt * 6.0, 0.85);
          arc.coreMat.opacity  = Math.min(arc.coreMat.opacity  + dt * 6.0, 1.00);

          if (arc.progress >= 1) {
            arc.state    = 'holding';
            arc.cooldown = 0.35;   // pause at destination
          }
          return;
        }

        if (arc.state === 'holding') {
          arc.cooldown -= dt;
          if (arc.cooldown <= 0) arc.state = 'fading';
          return;
        }

        if (arc.state === 'fading') {
          arc.lineMat.opacity  = Math.max(arc.lineMat.opacity  - dt * 1.6, 0);
          arc.headMat.opacity  = Math.max(arc.headMat.opacity  - dt * 4.0, 0);
          arc.coreMat.opacity  = Math.max(arc.coreMat.opacity  - dt * 4.0, 0);

          if (arc.lineMat.opacity <= 0) {
            arc.geo.setDrawRange(0, 0);
            arc.head.visible = false;
            arc.state    = 'idle';
            arc.cooldown = 1.2 + Math.random() * 3.5;   // rest before firing again
          }
        }
      });
    }

    /* ── City pulse animation ───────────────────────────────── */
    function updateCities(t) {
      CITIES.forEach(city => {
        const s = 1 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.8 + city.phase));
        city.glow.scale.setScalar(s);
        city.dotMat.opacity = 0.75 + 0.25 * Math.sin(t * 2.2 + city.phase);
      });
    }

    /* ═════════════════════════════════════════════════════════
       MOUSE TRACKING
    ═════════════════════════════════════════════════════════ */
    let targetX = 0, targetY = 0;
    let smoothX = 0, smoothY = 0;

    window.addEventListener('mousemove', e => {
      targetX =  (e.clientX / window.innerWidth  - 0.5) * 2;
      targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; }, { passive: true });

    /* ═════════════════════════════════════════════════════════
       RESIZE
    ═════════════════════════════════════════════════════════ */
    function resize() {
      const hero = document.querySelector('.hero');
      const W = hero ? hero.offsetWidth  : window.innerWidth;
      const H = hero ? hero.offsetHeight : Math.max(window.innerHeight * 0.75, 480);
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ═════════════════════════════════════════════════════════
       ANIMATION LOOP (delta-time)
    ═════════════════════════════════════════════════════════ */
    let t        = 0;
    let lastNow  = performance.now();

    (function animate() {
      requestAnimationFrame(animate);

      const now = performance.now();
      const dt  = Math.min((now - lastNow) / 1000, 0.05);   // cap at 50 ms
      lastNow   = now;
      t        += dt;

      /* Smooth cursor follow */
      smoothX += (targetX - smoothX) * 0.055;
      smoothY += (targetY - smoothY) * 0.055;

      /* Root rotation — oscillating (no full 360°) */
      root.rotation.y = Math.sin(t * 0.22) * 0.28 + smoothX * 0.85;
      root.rotation.x = Math.sin(t * 0.28) * 0.14 - smoothY * 0.22;
      root.rotation.z = Math.sin(t * 0.19) * 0.06;
      root.position.x = 0.55;
      root.position.z = Math.sin(t * 0.46) * 0.10;

      /* City + arc animations */
      updateCities(t);
      updateArcs(dt);

      renderer.render(scene, camera);
    })();
  }

  /* ── Trigger after THREE and DOM are ready ──────────────── */
  function tryInit() {
    if (window.THREE) { init(); }
    else {
      const s = document.querySelector('script[data-three]');
      if (s) s.addEventListener('load', init, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit, { once: true });
  } else {
    tryInit();
  }
})();
