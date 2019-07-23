const lib = require('../../lib/lib.js');

const ioMocks = require('../helpers/io-mocks.js');

test('create alice-bobbi module with defaults', () => {
  const mysnap = [];

  const mocks = ioMocks(mysnap);

  const options = {
    name: 'alice-bobbi',
    fs: mocks.fs,
  };

  // FUTURE TBD CORRECT BEHAVIOR:
  // return lib(options).then(() => { expect(mysnap).toMatchSnapshot() });
  // TBD ACTUAL EXPECTED RESULT DUE TO KNOWN ISSUE in lib.js:
  expect(() => {
    lib(options);
  }).toThrow();
});
