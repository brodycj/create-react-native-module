const lib = require('../../../../../lib/lib.js');

const ioInject = require('../../../helpers/io-inject.js');

test(`create alice-bobbi module with modulePrefix: 'custom-native'`, async () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    modulePrefix: 'custom-native'
  };

  await lib(options, inject);

  expect(mysnap).toMatchSnapshot();
});
