const lib = require('../../../../../../lib/lib.js');

const ioInject = require('../../../../helpers/io-inject.js');

test('create module with example, with `EACCES permission denied` error', async () => {
  // with snapshot info ignored in this test
  const ioInject2 = ioInject([]);
  const inject = {
    ...ioInject2,
    fs: {
      ...ioInject2.fs,
      readFileSync: (_) => {
        throw new Error('EACCES permission denied');
      }
    }
  };

  const options = {
    name: 'alice-bettty',
    generateExample: true
  };

  let error;
  try {
    // expected to throw:
    await lib(options, inject);
  } catch (e) {
    error = e;
  }
  expect(error).toBeDefined();
  expect(error.message).toMatch(/alice-bettty.example.package.json: EACCES permission denied/);
});
