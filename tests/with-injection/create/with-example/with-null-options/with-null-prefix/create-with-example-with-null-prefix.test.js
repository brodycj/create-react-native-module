const lib = require('../../../../../../lib/lib.js');

const ioInject = require('../../../../helpers/io-inject.js');

test('create alice-bobbi module with example, with prefix: null', async () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    prefix: null,
    generateExample: true,
  };

  await lib(options, inject);

  expect(mysnap).toMatchSnapshot();
});
