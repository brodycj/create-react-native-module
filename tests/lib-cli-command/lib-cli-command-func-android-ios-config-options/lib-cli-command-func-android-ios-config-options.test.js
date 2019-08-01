const func = require('../../../lib/cli-command.js').func;

const ioMocks = require('../../helpers/io-mocks.js');

test('create alice-bobbi module with explicit config options for Android & iOS', () => {
  const mysnap = [];

  const mocks = ioMocks(mysnap);

  const args = ['alice-bobbi'];

  const config = 'bogus';

  const options = {
    platforms: 'android,ios',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    fs: mocks.fs,
  };

  func(args, config, options);

  // Using a timer to wait for say 1 ms to wait for the
  // CLI command func to finish.
  return new Promise((resolve, reject) => setTimeout(resolve, 1))
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
