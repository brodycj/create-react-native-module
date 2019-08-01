const lib = require('../../lib/lib.js');

jest.mock('uuid', () => ({
  v1: () => 'E22606E0-B47F-11E9-A3F0-07F70A25DAFB'
}));

const ioMocks = require('../helpers/io-mocks.js');

test('create alice-bobbi module with config options for Windows only', () => {
  const mysnap = [];

  const mocks = ioMocks(mysnap);

  const options = {
    platforms: ['windows'],
    name: 'alice-bobbi',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    namespace: 'Carol',
    fs: mocks.fs,
  };

  return lib(options)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
