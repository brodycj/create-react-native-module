const command = require('../../../../../lib/cli-command.js');

test('cli-command object', () => {
  expect(command).toMatchSnapshot();
});
