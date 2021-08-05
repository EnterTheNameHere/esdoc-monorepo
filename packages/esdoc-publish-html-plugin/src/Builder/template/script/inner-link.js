// inner link(#foo) can not correctly scroll, because page has fixed header,
// so, I manually scroll.
(function() {
  const matched = location.hash.match(/errorLines=([\d,]+)/u);
  if (matched) return;

  function adjust() {
    window.scrollBy(0, -55);
    const el1 = document.querySelector('.inner-link-active');
    if (el1) el1.classList.remove('inner-link-active');

    // ``[ ] . ' " @`` are not valid in DOM id. so must escape these.
    const id = location.hash.replace(/([[\].'"@$])/gu, '\\$1');
    const el2 = document.querySelector(id);
    if (el2) el2.classList.add('inner-link-active');
  }

  window.addEventListener('hashchange', adjust);

  if (location.hash) {
    setTimeout(adjust, 0);
  }
})();

(function() {
  const els = document.querySelectorAll('[href^="#"]');
  const href = location.href.replace(/#.*$/u, ''); // remove existed hash
  for (let ii = 0; ii < els.length; ii = ii + 1) {
    const el3 = els[ii];
    el3.href = href + el3.getAttribute('href'); // because el.href is absolute path
  }
})();
