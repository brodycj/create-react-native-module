const lib = require('../../../../../lib/lib.js');

const ioInject = require('../../../helpers/io-inject.js');

test(`create alice-bobbi module with moduleName: 'custom-native-module'`, async () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    moduleName: 'custom-native-module'
  };

  await lib(options, inject);

  expect(mysnap).toMatchSnapshot();
});
