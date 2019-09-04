const lib = require('../../../../../../lib/lib.js');

const ioMocks = require('../../../../helpers/io-inject.js');

test('create alice-bobbi view module with example, with defaults', () => {
  const mysnap = [];

  const mocks = ioMocks(mysnap);

  const options = {
    name: 'alice-bobbi',
    generateExample: true,
    view: true,
  };

  return lib(options, mocks)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
