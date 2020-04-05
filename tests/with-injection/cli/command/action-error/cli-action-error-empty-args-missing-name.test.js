const action = require('../../../../../lib/cli-command.js').action;

test('create lib module with empty args - missing name', () => {
  const args = [];

  expect(() => { action(args, {}); }).toThrow("Please write your library's name");
});
