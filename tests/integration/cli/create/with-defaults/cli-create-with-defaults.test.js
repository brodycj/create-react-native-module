const execa = require('execa');
const path = require('path');

const readdirs = require('recursive-readdir');

const fs = require('fs-extra');

test('CLI creates correct package artifacts on file system, with no options', async () => {
  const mysnap = [];

  const name = `integration-test-package`;

  const modulePackageName = `react-native-${name}`;

  // remove test artifacts just in case:
  await fs.remove(modulePackageName);

  await execa.command(`node ${path.resolve('bin/cli.js')} ${name}`);

  const filesUnsorted = await readdirs(modulePackageName);

  // with sorting, since underlying readdirs does not guarantee the order
  // (using [].concat() function call to avoid overwriting a local object)
  const files = [].concat(filesUnsorted).sort();

  // THANKS for guidance:
  // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop/37576787#37576787
  // FUTURE TBD use a utility function to do this more functionally
  for (const path of files) {
    mysnap.push({
      name: path.replace(/\\/g, '/'),
      theContent: await fs.readFile(path, 'utf8')
    });
  }

  expect(mysnap).toMatchSnapshot();

  // cleanup generated test artifacts:
  await fs.remove(modulePackageName);
});
