const execa = require('execa');
const path = require('path');

const readdirs = require('recursive-readdir');

const fs = require('fs-extra');

test('CLI creates correct view module package artifacts on file system using `--view` option (and no other options)', async () => {
  const mysnap = [];

  const name = `integration-view-test-package`;

  const modulePackageName = `react-native-${name}`;

  // remove test artifacts just in case:
  await fs.remove(modulePackageName);

  await execa.command(`node ${path.resolve('bin/cli.js')} --view ${name}`);

  const filesUnsorted = await readdirs(modulePackageName);

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
  await fs.remove(modulePackageName);
});
