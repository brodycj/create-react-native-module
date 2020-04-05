const action = require('../../../../../lib/cli-command.js').action;

test('create lib module with undefined args - missing name', () => {
  const args = undefined;

  // reproduces the following error ref:
  // https://github.com/brodybits/create-react-native-module/issues/305
  expect(() => { action(args, {}); }).toThrow("Cannot read property 'length' of undefined");
});
