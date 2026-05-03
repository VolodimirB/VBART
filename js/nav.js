// Shared navigation component
(function () {
  function getRoot() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    return depth > 0 ? '../'.repeat(depth) : '';
  }

  function currentPage() {
    const p = window.location.pathname;
    if (p.endsWith('about.html') || p.endsWith('/about')) return 'about';
    if (p.endsWith('contact.html') || p.endsWith('/contact')) return 'contact';
    return 'home';
  }

  function buildNav() {
    const root = getRoot();
    const page = currentPage();

    const nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.innerHTML = `
      <div class="nav-inner">
        <a href="${root}index.html" class="nav-identity">
          <img class="nav-art" src="${root}Images/emanation/Orange Emanation, 3'x3', acrylic and oil on canvas, 2024.jpeg" alt="">
          <div class="nav-identity-text">
            <div class="nav-name">Veronika Bondarenko</div>
            <hr class="nav-identity-rule">
            <span class="nav-tagline">Abstract Painter&nbsp;&nbsp;·&nbsp;&nbsp;Toronto</span>
          </div>
        </a>
        <ul class="nav-links">
          <li><a href="${root}about.html" class="t-nav ${page === 'about' ? 'active' : ''}">About</a></li>
          <li><a href="${root}contact.html" class="t-nav ${page === 'contact' ? 'active' : ''}">Contact</a></li>
        </ul>
        <button class="nav-hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;

    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
      <button class="mobile-nav-close" aria-label="Close menu">×</button>
      <a href="${root}about.html" class="t-nav">About</a>
      <a href="${root}contact.html" class="t-nav">Contact</a>
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
