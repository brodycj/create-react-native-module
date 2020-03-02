const windowsTemplate = require('../../../../unsupported-platforms/windows-csharp');

// injected uuid:
const uuid = 'E22606E0-B47F-11E9-A3F0-07F70A25DAFB';

test('unsupported Windows C# template with options', () => {
  const options = {
    // normalized for name: 'alice-bobbi':
    name: 'AliceBobbi',
    // options
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    namespace: 'Carol',
    // injected uuid:
    uuid
  };

  const mysnap = [];

  windowsTemplate('windows').forEach(({ name, content }) => {
    mysnap.push({
      outputFileName: name(options),
      theContent: content(options)
    });
  });

  expect(mysnap).toMatchSnapshot();
});
