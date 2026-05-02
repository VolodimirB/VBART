// Shared navigation component
(function () {
  const COLLECTIONS = [
    { title: 'Spasm', slug: 'spasm' },
    { title: 'Conception', slug: 'conception' },
    { title: 'Emanation', slug: 'emanation' },
    { title: 'Inflection', slug: 'inflection' },
    { title: 'Golden Age', slug: 'golden-age' },
    { title: 'White on White', slug: 'white-on-white' },
    { title: 'Flare', slug: 'flare' },
  ];

  function getRoot() {
    // Figure out relative path depth
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    return depth > 0 ? '../'.repeat(depth) : '';
  }

  function currentPage() {
    const p = window.location.pathname;
    if (p.endsWith('about.html') || p.endsWith('/about')) return 'about';
    if (p.endsWith('contact.html') || p.endsWith('/contact')) return 'contact';
    if (p.includes('collection')) return 'work';
    return 'home';
  }

  function buildNav() {
    const root = getRoot();
    const page = currentPage();

    const dropdownLinks = COLLECTIONS.map(c =>
      `<a href="${root}collection.html#${c.slug}">${c.title}</a>`
    ).join('');

    const nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.innerHTML = `
      <div class="nav-inner">
        <a href="${root}index.html" class="nav-logo">Home</a>
        <ul class="nav-links">
          <li class="nav-dropdown">
            <span class="t-nav nav-dropdown-toggle ${page === 'work' ? 'active' : ''}">Work</span>
            <div class="nav-dropdown-menu">${dropdownLinks}</div>
          </li>
          <li><a href="${root}about.html" class="t-nav ${page === 'about' ? 'active' : ''}">About</a></li>
          <li><a href="${root}contact.html" class="t-nav ${page === 'contact' ? 'active' : ''}">Contact</a></li>
        </ul>
        <button class="nav-hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;

    // Mobile nav overlay
    const mobileCollLinks = COLLECTIONS.map(c =>
      `<a href="${root}collection.html#${c.slug}">${c.title}</a>`
    ).join('');

    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
      <button class="mobile-nav-close" aria-label="Close menu">×</button>
      ${mobileCollLinks}
      <div class="mobile-nav-meta">
        <a href="${root}about.html" class="t-nav">About</a>
        <a href="${root}contact.html" class="t-nav">Contact</a>
      </div>
    `;

    document.body.insertBefore(nav, document.body.firstChild);
    document.body.insertBefore(mobileNav, nav.nextSibling);

    // Hamburger toggle
    nav.querySelector('.nav-hamburger').addEventListener('click', () => {
      mobileNav.classList.add('open');
    });
    mobileNav.querySelector('.mobile-nav-close').addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
