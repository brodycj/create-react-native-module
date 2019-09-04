const lib = require('../../../../../lib/lib.js');

const ioMocks = require('../../../helpers/io-inject.js');

test('create alice-bobbi module with defaults', () => {
  const mysnap = [];

  const mocks = ioMocks(mysnap);

  const options = {
    name: 'alice-bobbi',
    generateExample: true,
  };

  return lib(options, mocks)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
