const action = require('../../../../../lib/cli-command.js').action;

test('create lib module with undefined args - missing name', () => {
  const args = undefined;

  // ref:
  // https://github.com/brodybits/create-react-native-module/issues/305
  expect(() => { action(args, {}); }).toThrow('missing lib module name');
});
