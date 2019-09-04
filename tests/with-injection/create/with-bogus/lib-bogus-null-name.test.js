const lib = require('../../../../lib/lib.js');

const ioInject = require('../../helpers/io-inject.js');

test('create module with bogus null name', async () => {
  // with snapshot info ignored in this test
  const inject = ioInject([]);

  const options = {
    name: null
  };

  let error;
  try {
    // expected to throw:
    await lib(options, inject);
  } catch (e) {
    error = e;
  }
  expect(error).toBeDefined();
  expect(error.message).toMatch(`Please write your library's name`);
});
