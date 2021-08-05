(function() {
  if (location.protocol === 'file:') {
    const elms = document.querySelectorAll('a[href="./"]');
    for (let ii = 0; ii < elms.length; ii = ii + 1) {
      elms[ii].href = './index.html';
    }
  }
})();
