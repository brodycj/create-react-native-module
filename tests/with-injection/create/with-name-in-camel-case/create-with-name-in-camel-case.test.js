const lib = require('../../../../lib/lib.js');

const ioInject = require('../../helpers/io-inject.js');

test('create alice-bobbi module with name in camel case', async () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'aliceBobbi',
  };

  await lib(options, inject);

  expect(mysnap).toMatchSnapshot();
});
