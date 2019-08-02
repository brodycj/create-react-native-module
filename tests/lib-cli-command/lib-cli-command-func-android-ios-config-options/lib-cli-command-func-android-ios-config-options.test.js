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

  return func(args, config, options)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
