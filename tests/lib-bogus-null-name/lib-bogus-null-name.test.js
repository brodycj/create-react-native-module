const lib = require('../../lib/lib.js');

const ioMocks = require('../helpers/io-mocks.js');

test('create module with bogus null name', async () => {
  // with snapshot info ignored in this test
  const ioInjected = ioMocks([]);

  const options = {
    name: null
  };

  let error;
  try {
    // expected to throw:
    await lib(options, ioInjected);
  } catch (e) {
    error = e;
  }
  expect(error).toBeDefined();
  expect(error.message).toMatch(`Please write your library's name`);
});
