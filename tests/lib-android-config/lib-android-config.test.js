const lib = require('../../lib/lib.js');

const mockfs = (mysnap) => ({
  outputFile: (name, content) => {
    mysnap.push(`output file name: ${name} content: ${content}\n`);
    return Promise.resolve();
  },
  ensureDir: (dir) => {
    mysnap.push(`ensure dir: ${dir}\n`);
    return Promise.resolve();
  },
});

test('create alice-bobbi module with options for Android only', () => {
  const mysnap = [];

  const options = {
    myfs: mockfs(mysnap),
    platforms:['android'],
    name:'alice-bobbi',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
  };

  return lib(options)
    .then(() => { expect(mysnap).toMatchSnapshot() });
});
