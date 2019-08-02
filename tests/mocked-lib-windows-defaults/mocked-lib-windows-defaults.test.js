const lib = require('../../lib/lib.js');

// special compact mocks for this test
// with mock uuid for Windows:
jest.mock('uuid', () => ({
  v1: () => 'E22606E0-B47F-11E9-A3F0-07F70A25DAFB'
}));
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

test('create alice-bobbi module using mocked lib with defaults on Windows', () => {
  const options = {
    platforms: ['windows'],
    name: 'alice-bobbi',
  };

  return lib(options)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
