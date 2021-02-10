const lib = require('../../../../../lib/lib.js');

const ioInject = require('../../../helpers/io-inject.js');

test('create alice-bobbi module with example, with config options including `exampleFileLinkage: true`', () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    objectClassName: 'SuperAwesomeModule',
    androidRootBuildSupport: true,
    tvosEnabled: true,
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    generateExample: true,
    exampleFileLinkage: true,
    exampleName: 'test-demo',
    exampleReactNativeVersion: 'react-native@0.60',
    useAppleNetworking: true,
    writeExamplePodfile: true,
  };

  return lib(options, inject)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
