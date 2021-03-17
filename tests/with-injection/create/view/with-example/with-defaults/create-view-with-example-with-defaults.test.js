const lib = require('../../../../../../lib/lib.js');

const ioInject = require('../../../../helpers/io-inject.js');

test('create alice-bobbi view module with example, with defaults', () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    generateExample: true,
    isView: true,
  };

  return lib(options, inject)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
