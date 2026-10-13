(function () {
  'use strict';

  const shellHeader = `
    <header class="site-header" data-header>
      <div class="container header-inner">
        <a class="brand" href="/" aria-label="EDINET投資レーダー ホーム">
          <img class="brand__mark" src="/favicon.svg" alt="" width="44" height="44">
          <span class="brand-copy"><strong>EDINET投資レーダー</strong><small>大株主の動きと株価の勢い</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-controls="global-nav" aria-expanded="false" aria-label="メニューを開く" data-menu-toggle><span></span><span></span><span></span></button>
        <nav class="global-nav" id="global-nav" aria-label="メインナビゲーション" data-nav>
          <ul>
            <li><a href="/watch/">JPX日経400</a></li>
            <li><a href="/topix/">新TOPIX</a></li>
          </ul>
        </nav>
      </div>
    </header>`;

  const shellFooter = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="brand brand--footer" href="/">
            <span class="brand-copy"><strong>EDINET投資レーダー</strong><small>大株主の動きと株価の勢い</small></span>
          </a>
          <small>運営：<a href="https://ugatta-llc.com/">合同会社UGATTA</a></small>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© 2026 合同会社UGATTA</span>
        <a class="footer-note-link" href="https://forms.gle/yjinqFdntoXhTmgk7" target="_blank" rel="noopener noreferrer">お問い合わせ ↗</a>
      </div>
    </footer>`;

  function elementFromHtml(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  function normalizeShell() {
    if (window.LabSiteShellNormalized) return;
    window.LabSiteShellNormalized = true;
    document.body.classList.add('site-shell-ready');

    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main';

    let skipLink = document.querySelector('.skip-link');
    if (!skipLink) {
      skipLink = document.createElement('a');
      skipLink.className = 'skip-link';
      document.body.prepend(skipLink);
    }
    skipLink.href = '#main';
    skipLink.textContent = '本文へ移動';

    // Pages built from _includes/ already carry the shared header and footer;
    // only older pages get theirs replaced here.
    const newHeader = elementFromHtml(shellHeader);
    const currentHeader = document.querySelector('.site-header') || document.querySelector('body > header:not(.top)');
    if (currentHeader && currentHeader.dataset.shell === 'static') {
      // Keep the header rendered at build time.
    } else if (currentHeader) {
      currentHeader.replaceWith(newHeader);
    } else {
      const pageHero = document.querySelector('body > header.top');
      if (pageHero) pageHero.before(newHeader);
      else if (main) main.before(newHeader);
      else document.body.prepend(newHeader);
    }

    const newFooter = elementFromHtml(shellFooter);
    const currentSiteFooter = document.querySelector('.site-footer');
    if (currentSiteFooter && currentSiteFooter.dataset.shell === 'static') return;
    if (currentSiteFooter) {
      currentSiteFooter.replaceWith(newFooter);
      return;
    }

    const pageFooter = document.querySelector('body > footer');
    if (pageFooter && pageFooter.matches('.shell.footer')) {
      const disclosure = document.createElement('div');
      Array.from(pageFooter.attributes).forEach(function (attribute) {
        disclosure.setAttribute(attribute.name, attribute.value);
      });
      disclosure.innerHTML = pageFooter.innerHTML;
      pageFooter.replaceWith(disclosure);
      disclosure.after(newFooter);
    } else if (pageFooter) {
      pageFooter.replaceWith(newFooter);
    } else {
      document.body.append(newFooter);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeShell);
  } else {
    normalizeShell();
  }
})();
