const lib = require('../../../../lib/lib.js');

const ioInject = require('../../helpers/io-inject.js');

test('create alice-bobbi module with swift language', () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    swift: true
  };

  return lib(options, inject)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
