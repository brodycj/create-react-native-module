const command = require('../../lib/cli-command.js');

test('cli-command options object', () => {
  expect(command.options).toMatchSnapshot();
});
