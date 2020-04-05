const action = require('../../../../../lib/cli-command.js').action;

test('create module with too many args', () => {
  const args = ['name1', 'name2'];

  // fails at this point, generating module package with name1 only
  // (issue 119 - extra arguments silently ignored)
  // TODO: add expected error message
  expect(() => { action(args, {}); }).toThrow();
});
