const execa = require('execa');
const path = require('path');

test('bin/cli.js with no arguments returns expected output', () => {
  // Test fix for issue #48
  return Promise.resolve(
    execa.command(`node ${path.resolve('bin/cli.js')}`)
  ).then(
    ({ stdout }) => {
      expect(stdout).toMatchSnapshot();
    }
  );
});
