const execa = require('execa');
const path = require('path');

test('bin/cli.js --help returns expected output', () => {
  // Thanks for iniitial guidance:
  // * https://medium.com/@ole.ersoy/unit-testing-commander-scripts-with-jest-bc32465709d6
  // * https://github.com/superflycss/cli/blob/master/index.spec.js
  return Promise.resolve(
    execa.command(`node ${path.resolve('bin/cli.js')} --help`)
  ).then(
    ({ stdout }) => {
      expect(stdout).toMatchSnapshot();
    }
  );
});
