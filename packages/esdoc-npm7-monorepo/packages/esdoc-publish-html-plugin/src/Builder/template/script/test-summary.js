(function() {
  function toggle(ev) {
    const button = ev.target;
    let parent = ev.target.parentElement;
    while(parent) {
      if (parent.tagName === 'TR' && parent.classList.contains('test-interface')) break;
      parent = parent.parentElement;
    }

    if (!parent) return;

    let direction = '';
    if (button.classList.contains('opened')) {
      button.classList.remove('opened');
      button.classList.add('closed');
      direction = 'closed';
    } else {
      button.classList.remove('closed');
      button.classList.add('opened');
      direction = 'opened';
    }

    const targetDepth = parseInt(parent.dataset.testDepth, 10) + 1;
    let nextElement = parent.nextElementSibling;
    while (nextElement) {
      const depth = parseInt(nextElement.dataset.testDepth, 10);
      if (depth >= targetDepth) {
        if (direction === 'opened') {
          if (depth === targetDepth)  nextElement.style.display = '';
        } else if (direction === 'closed') {
          nextElement.style.display = 'none';
          const innerButton = nextElement.querySelector('.toggle');
          if (innerButton && innerButton.classList.contains('opened')) {
            innerButton.classList.remove('opened');
            innerButton.classList.add('closed');
          }
        }
      } else {
        break;
      }
      nextElement = nextElement.nextElementSibling;
    }
  }

  const buttons = document.querySelectorAll('.test-summary tr.test-interface .toggle');
  for (let ii = 0; ii < buttons.length; ii = ii + 1) {
    buttons[ii].addEventListener('click', toggle);
  }

  const topDescribes = document.querySelectorAll('.test-summary tr[data-test-depth="0"]');
  for (let ii = 0; ii < topDescribes.length; ii++) {
    topDescribes[ii].style.display = '';
  }
})();
