const windowsTemplate = require('../../../../unsupported-platforms/windows-csharp');

// injected uuid:
const uuid = 'E22606E0-B47F-11E9-A3F0-07F70A25DAFB';

test('unsupported Windows C# template with defaults', () => {
  const options = {
    // normalized for name: 'alice-bobbi':
    name: 'AliceBobbi',
    namespace: 'Alice.Bobbi',
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
