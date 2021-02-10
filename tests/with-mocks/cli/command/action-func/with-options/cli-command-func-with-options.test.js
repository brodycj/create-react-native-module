const action = require('../../../../../../lib/cli-command.js').action;

// special compact mocks for this test:
const mysnap = [];
const mockpushit = x => mysnap.push(x);
jest.mock('fs-extra', () => ({
  outputFile: (outputFileName, theContent) => {
    mockpushit({
      outputFileName: outputFileName.replace(/\\/g, '/'),
      theContent
    });
    return Promise.resolve();
  },
  ensureDir: (dir) => {
    mockpushit({ ensureDir: dir.replace(/\\/g, '/') });
    return Promise.resolve();
  },
}));

test('create alice-bobbi module with explicit config options for Android & iOS', () => {
  const args = ['alice-bobbi'];

  const options = {
    platforms: 'android,ios',
    androidRootBuildSupport: true,
    tvosEnabled: true,
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
  };

  return action(args, options)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
