const lib = require('../../../../../lib/lib.js');

const ioMocks = require('../../../helpers/io-inject.js');

test('create alice-bobbi module with config options for Android only', () => {
  const mysnap = [];

  const mocks = ioMocks(mysnap);

  const options = {
    platforms: ['android'],
    name: 'alice-bobbi',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
  };

  return lib(options, mocks)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
