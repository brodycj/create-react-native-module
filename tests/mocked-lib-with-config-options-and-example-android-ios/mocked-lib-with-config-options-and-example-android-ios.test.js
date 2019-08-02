const lib = require('../../lib/lib.js');

// special compact mocks for this test:
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
  readFileSync: (path) => {
    mockpushit({ readFileSyncFromPath: path });
    return `{ "name": "x", "scripts": { "test": "exit 1" } }`;
  },
  writeFileSync: (path, json, options) => {
    mockpushit({ writeFileSyncToPath: path, json, options });
  },
}));
jest.mock('execa', () => ({
  commandSync: (command, options) => {
    mockpushit({ commandSync: command, options });
  }
}));

test('create alice-bobbi module using mocked lib with config options, with exampe, for Android and iOS', () => {
  const options = {
    platforms: ['android', 'ios'],
    name: 'alice-bobbi',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    generateExample: true,
  };

  return lib(options)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
