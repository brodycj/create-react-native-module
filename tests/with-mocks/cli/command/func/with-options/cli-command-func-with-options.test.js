const func = require('../../../../../../lib/cli-command.js').func;

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
}));

test('create alice-bobbi module with explicit config options for Android & iOS', () => {
  const args = ['alice-bobbi'];

  const config = 'bogus';

  const options = {
    platforms: 'android,ios',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
  };

  return func(args, config, options)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
