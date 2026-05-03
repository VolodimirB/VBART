// Home page: cursor-following preview images
(function () {
  const COLLECTIONS = [
    { slug: 'spasm' },
    { slug: 'conception' },
    { slug: 'emanation' },
    { slug: 'inflection' },
    { slug: 'golden-age' },
    { slug: 'white-on-white' },
    { slug: 'flare' },
  ];

  function isMobile() {
    return window.innerWidth <= 1100;
  }

  async function loadCovers() {
    const covers = {};
    await Promise.all(COLLECTIONS.map(async c => {
      try {
        const res = await fetch(`data/collections/${c.slug}.json`);
        const data = await res.json();
        covers[c.slug] = data.cover;
      } catch (e) {}
    }));
    return covers;
  }

  async function init() {
    const covers = await loadCovers();
    if (isMobile()) return;

    const links = document.querySelectorAll('.home-collection-list a[data-slug]');
    const preview = document.querySelector('.home-preview-image');
    const previewImg = preview ? preview.querySelector('img') : null;

    if (!preview || !previewImg) return;

    let mouseX = 0, mouseY = 0;

    function positionPreview() {
      const w = preview.offsetWidth;
      const h = preview.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let x = mouseX + 28;
      let y = mouseY - h / 2;

      if (x + w > vw - 16) x = mouseX - w - 28;
      if (y < 16) y = 16;
      if (y + h > vh - 16) y = vh - h - 16;

      preview.style.left = x + 'px';
      preview.style.top = y + 'px';
    }

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (preview.classList.contains('visible')) positionPreview();
    });

    links.forEach(link => {
      const slug = link.dataset.slug;
      const coverPath = covers[slug];

      link.addEventListener('mouseenter', () => {
        if (!coverPath || isMobile()) return;
        previewImg.src = coverPath;
        positionPreview();
        preview.classList.add('visible');
      });

      link.addEventListener('mouseleave', () => {
        preview.classList.remove('visible');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
