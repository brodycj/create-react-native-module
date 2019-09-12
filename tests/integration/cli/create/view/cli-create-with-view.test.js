const execa = require('execa');
const path = require('path');

const readdirs = require('recursive-readdir');

const fs = require('fs-extra');

test('CLI creates correct view module package artifacts on file system using `--view` option (and no other options)', async () => {
  const mysnap = [];

  // remove test artifacts just in case:
  fs.removeSync(`react-native-integration-view-test-package`);

  await execa.command(
    `node ${path.resolve('bin/cli.js')} --view integration-view-test-package`);

  const filesUnsorted =
    await readdirs('react-native-integration-view-test-package');

  // with sorting, since underlying readdirs does not guarantee the order
  // (using [].concat() function call to avoid overwriting a local object)
  const files = [].concat(filesUnsorted).sort();

  files.forEach(name =>
    mysnap.push({
      name: name.replace(/\\/g, '/'),
      contents: fs.readFileSync(name).toString()
    })
  );

  expect(mysnap).toMatchSnapshot();

  // cleanup generated test artifacts:
  fs.removeSync(`react-native-integration-view-test-package`);
});
