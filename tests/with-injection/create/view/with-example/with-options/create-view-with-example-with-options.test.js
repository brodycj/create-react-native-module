const lib = require('../../../../../../lib/lib.js');

const ioMocks = require('../../../../helpers/io-inject.js');

test('create alice-bobbi view module with example, with custom config options', () => {
  const mysnap = [];

  const mocks = ioMocks(mysnap);

  const options = {
    name: 'alice-bobbi',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    view: true,
    generateExample: true,
    exampleName: 'test-demo',
    exampleReactNativeVersion: 'react-native@0.60',
  };

  return lib(options, mocks)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
