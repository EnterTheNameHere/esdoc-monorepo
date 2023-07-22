process.env.esdoc_fixture_path = './sample-projects/standard-esdoc-test-fixture/'

module.exports = {
  'require': 'babelRegister.js',
  'timeout': 5000, // Milliseconds
  'extension': ['.test.mjs'],
  'recursive': true,
  'checkLeaks': true,
  'forbidPending': true,
  'fullTrace': true
};
