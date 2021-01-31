import assert from 'assert';
import IceCap from '../../src/IceCap.js';

describe('IceCap:', function () {
  describe('#constructor', function () {
    it('throws error if html is not specified.', function () {
      try {
        const ice = new IceCap(); // eslint-disable-line no-unused-vars
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });

    it('has options.', function () {
      const ice = new IceCap('<div></div>', {autoDrop: false, autoClose: false});
      assert.equal(ice.autoDrop, false);
      assert.equal(ice.autoClose, false);

      ice.autoDrop = true;
      ice.autoClose = true;
      assert.equal(ice.autoDrop, true);
      assert.equal(ice.autoClose, true);
    });
  });

  describe('#text', function () {
    it('process text with default mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      ice.text('name', 'Alice');
      assert.equal(ice.html, '<div data-ice="name">Name: Alice</div>');
    });

    it('process text with append mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      ice.text('name', 'Alice', IceCap.MODE_APPEND);
      assert.equal(ice.html, '<div data-ice="name">Name: Alice</div>');
    });

    it('process text with write mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      ice.text('name', 'Alice', IceCap.MODE_WRITE);
      assert.equal(ice.html, '<div data-ice="name">Alice</div>');
    });

    it('process text with remove mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: Alice</div>');
      ice.text('name', 'Alice', IceCap.MODE_REMOVE);
      assert.equal(ice.html, '<div data-ice="name">Name: </div>');
    });

    it('process text with prepend mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: Alice</div>');
      ice.text('name', 'My ', IceCap.MODE_PREPEND);
      assert.equal(ice.html, '<div data-ice="name">My Name: Alice</div>');
    });

    it('process auto drop with empty value.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      ice.text('name', null);
      assert.equal(ice.html, '');
    });

    it('does not process auto drop with empty value.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>', {autoDrop: false});
      ice.text('name', null);
      assert.equal(ice.html, '<div data-ice="name">Name: </div>');
    });

    it('throws error if id is not specified.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      try {
        ice.text();
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });

    it('throws error with unknown mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      try {
        ice.text('name', 'Alice', 'invalid mode');
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });
  });

  describe('#load', function () {
    it('process html with default mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      ice.load('name', '<span>Alice</span>');
      assert.equal(ice.html, '<div data-ice="name">Name: <span>Alice</span></div>');
    });

    it('process html with append mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      ice.load('name', '<span>Alice</span>', IceCap.MODE_APPEND);
      assert.equal(ice.html, '<div data-ice="name">Name: <span>Alice</span></div>');
    });

    it('process html with write mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      ice.load('name', '<span>Alice</span>', IceCap.MODE_WRITE);
      assert.equal(ice.html, '<div data-ice="name"><span>Alice</span></div>');
    });

    it('process html with remove mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: <span>Alice</span></div>');
      ice.load('name', '<span>Alice</span>', IceCap.MODE_REMOVE);
      assert.equal(ice.html, '<div data-ice="name">Name: </div>');
    });

    it('process html with prepend mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: Alice</div>');
      ice.load('name', '<span>My </span>', IceCap.MODE_PREPEND);
      assert.equal(ice.html, '<div data-ice="name"><span>My </span>Name: Alice</div>');
    });

    it('process auto drop with empty value.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      ice.load('name', null);
      assert.equal(ice.html, '');
    });

    it('does not process auto drop with empty value.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>', {autoDrop: false});
      ice.load('name', null);
      assert.equal(ice.html, '<div data-ice="name">Name: </div>');
    });

    it('process other ice cap.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      const otherIce = new IceCap('<span data-ice="other-name">Alice</span>');
      ice.load('name', otherIce);
      ice.load('other-name', 'Bob');
      assert.equal(ice.html, '<div data-ice="name">Name: <span data-ice="other-name">Alice</span></div>');
    });

    it('throws error if id is not specified.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      try {
        ice.load();
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });

    it('throws error with unknown mode.', function () {
      const ice = new IceCap('<div data-ice="name">Name: </div>');
      try {
        ice.load('name', '<span>Alice</span>', 'invalid mode');
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });
  });

  describe('#attr', function () {
    it('process attr with default mode.', function () {
      const ice = new IceCap('<a data-ice="name"></a>');
      ice.attr('name', 'href', 'test.html');
      assert.equal(ice.html, '<a data-ice="name" href="test.html"></a>');
    });

    it('process attr with append mode.', function () {
      const ice = new IceCap('<a data-ice="name" href="test.html"></a>');
      ice.attr('name', 'href', '#anchor', IceCap.MODE_APPEND);
      assert.equal(ice.html, '<a data-ice="name" href="test.html#anchor"></a>');
    });

    it('process attr with write mode.', function () {
      const ice = new IceCap('<a data-ice="name" href="test.html"></a>');
      ice.attr('name', 'href', 'foo.html', IceCap.MODE_WRITE);
      assert.equal(ice.html, '<a data-ice="name" href="foo.html"></a>');
    });

    it('process attr with remove mode.', function () {
      const ice = new IceCap('<a data-ice="name" href="test.html"></a>');
      ice.attr('name', 'href', 'test.html', IceCap.MODE_REMOVE);
      assert.equal(ice.html, '<a data-ice="name" href></a>');
    });

    it('process attr with prepend mode.', function () {
      const ice = new IceCap('<a data-ice="name" href="test.html"></a>');
      ice.attr('name', 'href', 'foo/', IceCap.MODE_PREPEND);
      assert.equal(ice.html, '<a data-ice="name" href="foo/test.html"></a>');
    });

    it('throws error if id is not specified.', function () {
      const ice = new IceCap('<a data-ice="name">Name: </a>');
      try {
        ice.attr();
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });

    it('throws error with unknown mode.', function () {
      const ice = new IceCap('<a data-ice="name"></a>');
      try {
        ice.attr('name', 'href', 'test.html', 'invalid mode');
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });
  });

  describe('#loop', function () {
    it('process loop.', function () {
      const ice = new IceCap('<ul><li data-ice="name"></li></ul>');
      ice.loop('name', ['Alice', 'Bob', 'Carol'], (i, name, ice2) => {
        ice2.text('name', name);
      });
      assert.equal(ice.html, '<ul><li data-ice="name">Alice</li>\n<li data-ice="name">Bob</li>\n<li data-ice="name">Carol</li>\n</ul>');
    });

    it('process loop with text callback.', function () {
      const ice = new IceCap('<ul><li data-ice="name"></li></ul>');
      ice.loop('name', ['Alice', 'Bob', 'Carol'], IceCap.CALLBACK_TEXT);
      assert.equal(ice.html, '<ul><li data-ice="name">Alice</li>\n<li data-ice="name">Bob</li>\n<li data-ice="name">Carol</li>\n</ul>');
    });

    it('process loop with load callback.', function () {
      const ice = new IceCap('<ul><li data-ice="name"></li></ul>');
      ice.loop('name', ['<span>Alice</span>', '<span>Bob</span>', '<span>Carol</span>'], IceCap.CALLBACK_LOAD);
      assert.equal(ice.html, '<ul><li data-ice="name"><span>Alice</span></li>\n<li data-ice="name"><span>Bob</span></li>\n<li data-ice="name"><span>Carol</span></li>\n</ul>');
    });

    it('process loop with multi root template.', function () {
      const ice = new IceCap('<div data-ice="title"></div><span data-ice="name"></span>');
      ice.text('title', 'Users');
      ice.loop('name', ['Alice', 'Bob', 'Carol'], (i, name, ice2) => {
        ice2.text('name', name);
      });
      assert.equal(ice.html, '<div data-ice="title">Users</div><span data-ice="name">Alice</span>\n<span data-ice="name">Bob</span>\n<span data-ice="name">Carol</span>\n');
    });

    it('process loop with empty values.', function () {
      const ice = new IceCap('<ul><li data-ice="name"></li></ul>');
      ice.loop('name', [], IceCap.CALLBACK_TEXT);
      assert.equal(ice.html, '<ul></ul>');
    });

    it('throws error with non-array values.', function () {
      const ice = new IceCap('<ul><li data-ice="name"></li></ul>');
      try {
        ice.loop('name', {}, IceCap.CALLBACK_TEXT);
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });

    it('throws error if id is not specified.', function () {
      const ice = new IceCap('<ul><li data-ice="name">Name: </li></ul>');
      try {
        ice.loop();
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });

    it('throws error with non-function callback.', function () {
      const ice = new IceCap('<ul><li data-ice="name"></li></ul>');
      try {
        ice.loop('name', [], {});
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });

    it('throws error with unknown callback.', function () {
      const ice = new IceCap('<ul><li data-ice="name"></li></ul>');
      try {
        ice.loop('name', ['Alice', 'Bob', 'Carol'], 'invalid mode');
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });
  });

  describe('#into', function () {
    it('process into.', function () {
      const ice = new IceCap('<div data-ice="exampleWrap"><h1>Example</h1><div data-ice="example"></div></div>');
      ice.into('exampleWrap', 'this is example', (example, ice2) => {
        ice2.text('example', example);
      });
      assert.equal(ice.html, '<div data-ice="exampleWrap"><h1>Example</h1><div data-ice="example">this is example</div></div>');
    });

    it('drops element with empty string value.', function () {
      const ice = new IceCap('<div data-ice="exampleWrap"><h1>Example</h1><div data-ice="example"></div></div>');
      ice.into('exampleWrap', '', () => {});
      assert.equal(ice.html, '');
    });

    it('drops element with null value.', function () {
      const ice = new IceCap('<div data-ice="exampleWrap"><h1>Example</h1><div data-ice="example"></div></div>');
      ice.into('exampleWrap', null, () => {});
      assert.equal(ice.html, '');
    });

    it('drops element with undefined value.', function () {
      const ice = new IceCap('<div data-ice="exampleWrap"><h1>Example</h1><div data-ice="example"></div></div>');
      ice.into('exampleWrap', undefined, () => {});
      assert.equal(ice.html, '');
    });

    it('drops element with empty array value.', function () {
      const ice = new IceCap('<div data-ice="exampleWrap"><h1>Example</h1><div data-ice="example"></div></div>');
      ice.into('exampleWrap', [], () => {});
      assert.equal(ice.html, '');
    });

    it('throws error if id is not specified.', function () {
      const ice = new IceCap('<div data-ice="exampleWrap"><h1>Example</h1><div data-ice="example"></div></div>');
      try {
        ice.into();
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });

    it('throws error with non-function callback.', function () {
      const ice = new IceCap('<div data-ice="exampleWrap"><h1>Example</h1><div data-ice="example"></div></div>');
      try {
        ice.into('exampleWrap', 'this is example', {});
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });
  });

  describe('#drop', function () {
    it('drops node.', function () {
      const ice = new IceCap('<div><span data-ice="name"></span></div>');
      ice.drop('name');
      assert.equal(ice.html, '<div></div>');
    });

    it('does not drop node.', function () {
      const ice = new IceCap('<div><span data-ice="name"></span></div>');
      ice.drop('name', false);
      assert.equal(ice.html, '<div><span data-ice="name"></span></div>');
    });

    it('throws error if id is not specified.', function () {
      const ice = new IceCap('<div><span data-ice="name"></span></div>');
      try {
        ice.drop();
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
    });
  });

  describe('#close', function () {
    it('can not process after close.', function () {
      const ice = new IceCap('<div><span data-ice="name"></span></div>');
      ice.close();
      try {
        ice.drop('name');
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
      ice.close();
      assert.equal(ice.html, '<div><span data-ice="name"></span></div>');
    });
  });

  describe('#html', function () {
    it('process auto close after html.', function () {
      const ice = new IceCap('<div><span data-ice="name"></span></div>');
      ice.html;
      try {
        ice.drop('name');
        assert(false, 'unreachable');
      } catch(e) {
        assert(e instanceof Error);
      }
      assert.equal(ice.html, '<div><span data-ice="name"></span></div>');
    });

    it('does not process auto close after html.', function () {
      const ice = new IceCap('<div><span data-ice="name"></span></div>', {autoClose: false});
      ice.html;
      ice.drop('name');
      assert.equal(ice.html, '<div></div>');
    });
  });
});
