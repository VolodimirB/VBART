// Home page: hover preview images
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

  // Don't show preview on touch/mobile
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
      } catch (e) {
        // silently skip
      }
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

    links.forEach(link => {
      const slug = link.dataset.slug;
      const coverPath = covers[slug];

      link.addEventListener('mouseenter', () => {
        if (!coverPath || isMobile()) return;
        previewImg.src = coverPath;
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
