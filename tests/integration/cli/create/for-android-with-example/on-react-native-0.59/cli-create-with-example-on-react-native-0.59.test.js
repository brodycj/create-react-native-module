const execa = require('execa');
const path = require('path');

const readdirs = require('recursive-readdir');

const fs = require('fs-extra');

// XXX TBD ???:
const MY_TIMEOUT = 10 * 60 * 1000;

test('CLI creates correct package artifacts on file system, with no options', async () => {
  const mysnap = [];

  const name = `integration-test-package-with-example`;

  const modulePackageName = `react-native-${name}`;

  // remove test artifacts just in case:
  await fs.remove(modulePackageName);

  const cmdPrefix = `node ${path.resolve('bin/cli.js')}`;

  const cmdOptions =
    `--generate-example --example-react-native-version react-native@0.59.10 --platforms android`;

  const cmd = `${cmdPrefix} ${cmdOptions} ${name}`;

  console.info('starting cli.js, could take a few minutes');

  await execa.command(cmd, { stdio: 'inherit' });

  // NOTE: generated example/node_modules are ignored,
  // not expected to be committed in a real module
  // and we do not want to check example/yarn.lock
  // due to its unstable nature
  // (and remove some other artifacts that we don't really want to check)
  console.info(
    'removing generated example/yarn.lock & example/node_modules artifacts');
  await fs.remove(`${modulePackageName}/example/yarn.lock`);
  await fs.remove(`${modulePackageName}/example/node_modules`);
  // and remove images that we don't really care about
  await fs.remove(`${modulePackageName}/example/android/app/src/main/res`);
  // also don't really want to check binary JAR artifact here:
  await fs.remove(
    `${modulePackageName}/example/android/gradle/wrapper/gradle-wrapper.jar`);

  console.info(
    'generated example/yarn.lock & example/node_modules artifacts now removed');

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
}, MY_TIMEOUT);
