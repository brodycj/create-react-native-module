const lib = require('../../../../../../lib/lib.js');

const ioInject = require('../../../../helpers/io-inject.js');

test(`create alice-bobbi module with defaults, with platforms: 'bogus'`, async () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    platforms: 'bogus'
  };

  await lib(options, inject);
  expect(mysnap).toMatchSnapshot();
});
