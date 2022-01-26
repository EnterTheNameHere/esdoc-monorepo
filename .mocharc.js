const path = require('path');

module.exports = {
  'require': path.resolve( __dirname, path.join( 'test', 'babelRegister.js' ) ),
  'timeout': 5000, // Milliseconds
  'extension': ['.test.js'],
  'recursive': true,
  'checkLeaks': true,
  'forbidPending': true,
  'fullTrace': true
};
