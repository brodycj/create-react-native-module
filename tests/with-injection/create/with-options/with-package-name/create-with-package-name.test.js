const lib = require('../../../../../lib/lib.js');

const ioInject = require('../../../helpers/io-inject.js');

test(`create alice-bobbi module package with custom packageName`, async () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    packageName: 'custom-native-module'
  };

  await lib(options, inject);

  expect(mysnap).toMatchSnapshot();
});
