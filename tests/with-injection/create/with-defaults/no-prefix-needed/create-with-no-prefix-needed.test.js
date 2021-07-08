const lib = require('../../../../../lib/lib.js');

const ioInject = require('../../../helpers/io-inject.js');

test('create with defaults, with no prefix needed', () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'react-native-alice',
  };

  return lib(options, inject)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
