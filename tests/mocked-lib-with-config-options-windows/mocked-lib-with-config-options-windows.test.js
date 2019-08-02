const lib = require('../../lib/lib.js');

jest.mock('uuid', () => ({
  v1: () => 'E22606E0-B47F-11E9-A3F0-07F70A25DAFB'
}));

/* XXX TBD GONE:
const ioMocks = require('../helpers/io-mocks.js');
// */

const mysnap = [];
const mockpushit = x => mysnap.push(x);
jest.mock('fs-extra', () => ({
  outputFile: (outputFileName, theContent) => {
    mockpushit({ outputFileName, theContent });
    return Promise.resolve();
  },
  ensureDir: (dir) => {
    mockpushit({ ensureDir: dir });
    return Promise.resolve();
  },
}));

test('create alice-bobbi module using mocked lib with config options on Windows', () => {
  /* XXX TBD GONE:
  const mysnap = [];

  const mocks = ioMocks(mysnap);
  // */

  const options = {
    platforms: ['windows'],
    name: 'alice-bobbi',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    namespace: 'Carol',
  };

  return lib(options)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
