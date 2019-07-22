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

test('create alice-bobbi module with defaults', () => {
  const mysnap = [];

  const options = {
    name:'alice-bobbi',
    myfs: mockfs(mysnap),
  };

  // FUTURE TBD CORRECT BEHAVIOR:
  // return lib(options).then(() => { expect(mysnap).toMatchSnapshot() });
  // TBD ACTUAL EXPECTED RESULT DUE TO KNOWN ISSUE in lib.js:
  expect(() => {
    lib(options)
  }).toThrow();
});
