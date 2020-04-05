const action = require('../../../../../lib/cli-command.js').action;

test('create module with too many args', () => {
  const args = ['name1', 'name2'];

  // ref:
  // https://github.com/brodybits/create-react-native-module/issues/119
  expect(() => { action(args, {}); }).toThrow('too many arguments');
});
