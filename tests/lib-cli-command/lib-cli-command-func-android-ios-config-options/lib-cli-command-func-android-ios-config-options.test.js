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

  // TBD use an XXX ms timer
  // (try 4000 ms (4 seconds) at first)
  // since we cannot tell for sure
  // how long it will take for func to finish:

  return new Promise((resolve, reject) => setTimeout(resolve, 4000))
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
