const lib = require('../../lib/lib.js');

const ioMocks = require('../helpers/io-mocks.js');

test('create alice-bobbi view module with example, with defaults', () => {
  const mysnap = [];

  const mocks = ioMocks(mysnap);

  const options = {
    name: 'alice-bobbi',
    generateExample: true,
    view: true,
    fs: mocks.fs,
    execa: mocks.execa,
  };

  return lib(options).then(() => { expect(mysnap).toMatchSnapshot(); });
});
