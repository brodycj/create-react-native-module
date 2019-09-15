const lib = require('../../../../../lib/lib.js');

const ioInject = require('../../../helpers/io-inject.js');

test('create module with example, with `yarn add` failure', async () => {
  // with snapshot info ignored in this test
  const ioInject2 = ioInject([]);
  const inject = {
    ...ioInject2,
    execa: {
      commandSync: (command, _) => {
        if (/yarn add/.test(command)) {
          throw new Error('ENOPERM not permitted');
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
  expect(error.message).toMatch(/ENOPERM not permitted/);
});
