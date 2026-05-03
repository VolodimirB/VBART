// Collection page: load JSON, render cards, lightbox
(function () {
  const COLLECTIONS = [
    { title: 'Spasm',         slug: 'spasm' },
    { title: 'Conception',    slug: 'conception' },
    { title: 'Emanation',     slug: 'emanation' },
    { title: 'Inflection',    slug: 'inflection' },
    { title: 'Golden Age',    slug: 'golden-age' },
    { title: 'White on White',slug: 'white-on-white' },
    { title: 'Flare',         slug: 'flare' },
  ];

  let paintings = [];
  let currentIndex = 0;

  // ── Helpers ──────────────────────────────────────────────
  function getSlug() {
    return window.location.hash.slice(1) || new URLSearchParams(window.location.search).get('slug') || '';
  }

  function metaString(p) {
    const parts = [];
    if (p.medium) parts.push(p.medium);
    if (p.dimensions) parts.push(p.dimensions);
    if (p.year) parts.push(p.year);
    return parts.join('  ·  ');
  }

  // ── Lightbox ─────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbMeta = document.getElementById('lb-meta');

  const ZOOM_LEVELS = [1, 2.5, 5];
  let zoomStep = 0; // 0 = normal, 1 = 2.5x, 2 = 5x
  let zoomed = false;
  // Pan state (translate in px, applied on top of scale)
  let panX = 0, panY = 0;
  let dragging = false;
  let dragStartX = 0, dragStartY = 0;
  let panStartX = 0, panStartY = 0;
  let didDrag = false;
  let justZoomedOut = false;

  function openLightbox(index) {
    currentIndex = index;
    resetZoom();
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    resetZoom();
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function resetZoom() {
    zoomed = false;
    zoomStep = 0;
    panX = 0;
    panY = 0;
    applyTransform();
    lbImg.style.cursor = 'zoom-in';
    lbImg.style.transition = 'transform 250ms ease';
  }

  function applyTransform() {
    const scale = ZOOM_LEVELS[zoomStep];
    if (zoomStep > 0) {
      lbImg.style.transform = `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`;
    } else {
      lbImg.style.transform = '';
    }
  }

  function zoomIn(e) {
    const nextStep = zoomStep + 1;
    if (nextStep >= ZOOM_LEVELS.length) {
      // At max zoom — reset
      justZoomedOut = true;
      resetZoom();
      return;
    }
    // Set transform origin to click point
    const rect = lbImg.getBoundingClientRect();
    const ox = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const oy = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
    lbImg.style.transformOrigin = `${50 + ox}% ${50 + oy}%`;
    lbImg.style.transition = 'transform 250ms ease';
    panX = 0;
    panY = 0;
    zoomStep = nextStep;
    zoomed = zoomStep > 0;
    applyTransform();
    lbImg.style.cursor = zoomStep < ZOOM_LEVELS.length - 1 ? 'zoom-in' : 'grab';
  }

  // ── Drag to pan ──────────────────────────────────────────
  lbImg.addEventListener('mousedown', e => {
    if (!zoomed || e.button !== 0) return;
    e.preventDefault();
    dragging = true;
    didDrag = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    panStartX = panX;
    panStartY = panY;
    lbImg.style.cursor = 'grabbing';
    lbImg.style.transition = 'none';
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true;
    panX = panStartX + dx;
    panY = panStartY + dy;
    applyTransform();
  });

  window.addEventListener('mouseup', e => {
    if (!dragging || e.button !== 0) return;
    dragging = false;
    lbImg.style.transition = 'transform 250ms ease';
    updateCursor();
  });

  // Touch panning
  let lastTouchX = 0, lastTouchY = 0;
  lbImg.addEventListener('touchstart', e => {
    if (!zoomed || e.touches.length !== 1) return;
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
    panStartX = panX;
    panStartY = panY;
    lbImg.style.transition = 'none';
  }, { passive: true });

  lbImg.addEventListener('touchmove', e => {
    if (!zoomed || e.touches.length !== 1) return;
    e.preventDefault();
    panX = panStartX + (e.touches[0].clientX - lastTouchX);
    panY = panStartY + (e.touches[0].clientY - lastTouchY);
    applyTransform();
  }, { passive: false });

  lbImg.addEventListener('touchend', () => {
    lbImg.style.transition = 'transform 250ms ease';
  });

  function updateCursor() {
    if (zoomStep === 0) lbImg.style.cursor = 'zoom-in';
    else if (zoomStep < ZOOM_LEVELS.length - 1) lbImg.style.cursor = 'zoom-in';
    else lbImg.style.cursor = 'zoom-out';
  }

  // ── Click: step zoom in → in → out ───────────────────────
  lbImg.addEventListener('click', e => {
    e.stopPropagation();
    if (didDrag) { didDrag = false; return; } // was a pan, ignore

    if (zoomStep < ZOOM_LEVELS.length - 1) {
      // Zoom in one step
      const rect = lbImg.getBoundingClientRect();
      const ox = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
      const oy = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
      lbImg.style.transformOrigin = `${50 + ox}% ${50 + oy}%`;
      lbImg.style.transition = 'transform 250ms ease';
      panX = 0;
      panY = 0;
      zoomStep++;
      zoomed = true;
      applyTransform();
    } else {
      // At max zoom — reset
      resetZoom();
    }
    updateCursor();
  });

  function updateLightbox() {
    const p = paintings[currentIndex];
    if (!p) return;
    lbImg.src = p.image;
    lbImg.alt = p.title;
    lbTitle.textContent = p.title;
    lbMeta.textContent = metaString(p);
  }

  function prevPainting() {
    resetZoom();
    currentIndex = (currentIndex - 1 + paintings.length) % paintings.length;
    updateLightbox();
  }

  function nextPainting() {
    resetZoom();
    currentIndex = (currentIndex + 1) % paintings.length;
    updateLightbox();
  }

  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', prevPainting);
  document.getElementById('lb-next').addEventListener('click', nextPainting);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPainting();
    if (e.key === 'ArrowRight') nextPainting();
  });

  // ── Sidebar ───────────────────────────────────────────────
  function buildSidebar(activeSlug) {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;
    nav.innerHTML = COLLECTIONS.map(c => `
      <a href="collection.html#${c.slug}" class="sidebar-link${c.slug === activeSlug ? ' active' : ''}">${c.title}</a>
    `).join('');
  }

  // ── Render cards ─────────────────────────────────────────
  function renderCards(data, slug) {
    paintings = data.paintings || [];

    document.title = `${data.title} — Veronika Bondarenko`;
    const titleEl = document.getElementById('collection-title');
    if (titleEl) titleEl.textContent = data.title;

    const descEl = document.getElementById('collection-description');
    if (descEl) {
      if (data.description) {
        descEl.textContent = data.description;
        descEl.style.display = '';
      } else {
        descEl.style.display = 'none';
      }
    }

    buildSidebar(slug);

    const grid = document.getElementById('collection-grid');
    if (!grid) return;

    grid.innerHTML = '';
    paintings.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'painting-card';
      card.innerHTML = `
        <div class="painting-card-image">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
        <div class="painting-card-info">
          <div class="painting-card-title">${p.title}</div>
          <div class="painting-card-meta">${metaString(p)}</div>
        </div>
      `;
      card.addEventListener('click', () => openLightbox(i));
      grid.appendChild(card);
    });
  }

  // ── Load data ────────────────────────────────────────────
  async function init() {
    const slug = getSlug();
    if (!slug) {
      document.getElementById('collection-title').textContent = 'Collection not found';
      return;
    }

    try {
      const res = await fetch(`data/collections/${slug}.json`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      renderCards(data, slug);
    } catch (e) {
      document.getElementById('collection-title').textContent = 'Collection not found';
    }
  }

  window.addEventListener('hashchange', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
