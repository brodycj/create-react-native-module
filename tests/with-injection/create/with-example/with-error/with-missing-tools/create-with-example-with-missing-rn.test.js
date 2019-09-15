const lib = require('../../../../../../lib/lib.js');

const ioInject = require('../../../../helpers/io-inject.js');

test('create module with example, with `react-native --version` not working', async () => {
  // with snapshot info ignored in this test
  const ioInject2 = ioInject([]);
  const inject = {
    ...ioInject2,
    execa: {
      commandSync: (command, _) => {
        if (/react-native/.test(command)) {
          throw new Error('command not found');
        }
      }
    }
  };

  const options = {
    name: 'alice-bettty',
    generateExample: true
  };

  let error;
  try {
    // expected to throw:
    await lib(options, inject);
  } catch (e) {
    error = e;
  }
  expect(error).toBeDefined();
  expect(error.message).toMatch(
    `react-native --version failed; both react-native-cli and yarn CLI tools are needed to generate example project`);
});
