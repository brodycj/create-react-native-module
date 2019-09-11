const execa = require('execa');
const path = require('path');

const fs = require('fs-extra');

const tar = require('tar');

test('CLI creates correct package artifacts on file system, with no options', async () => {
  // remove test artifacts just in case:
  fs.removeSync(`check-integration-test-package.tar`);
  fs.removeSync(`react-native-integration-test-package`);

  await execa.command(
    `node ${path.resolve('bin/cli.js')} integration-test-package`);

  // uses tar output to check both correct tree and correct contents
  // (using `gzip: true` to make the output less redundant)
  await tar.c({
    file: `check-integration-test-package.tar`,
    gzip: true,
    portable: true,
    noMtime: true
  }, ['react-native-integration-test-package']);

  const checkObject = fs.readFileSync(`check-integration-test-package.tar`);

  // TBD THE OUTPUT OF THIS SNAPSHOT SEEMS TO BE TOO VERBOSE:
  // expect(checkObject).toMatchSnapshot();

  // less verbose text output, seems to be just under 9K:
  const base64 = checkObject.toString('base64');
  expect(base64).toMatchSnapshot();

  // cleanup generated test artifacts:
  fs.removeSync(`check-integration-test-package.tar`);
  fs.removeSync(`react-native-integration-test-package`);
});
