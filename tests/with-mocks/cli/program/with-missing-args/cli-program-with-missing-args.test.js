// special compact mocks for this test:
const mysnap = [];
const mockpushit = x => mysnap.push(x);
jest.mock('update-notifier', () => ({ pkg }) => {
  // only check a limited number of fields in pkg
  expect(pkg.name).toBeDefined();
  expect(pkg.version).toBeDefined();
  return { notify: () => mockpushit({ notify: {} }) };
});
const mockCommander = {
  args: ['test-package'],
  version: (version) => {
    // actual value of version not expected to be stable
    expect(version).toBeDefined();
    mockpushit({ version: 'x' });
    return mockCommander;
  },
  usage: (usage) => {
    mockpushit({ usage });
    return mockCommander;
  },
  description: (description) => {
    mockpushit({ description });
    return mockCommander;
  },
  action: (_) => {
    mockpushit({ action: {} });
    return mockCommander;
  },
  option: (...args) => {
    mockpushit({ option: { args } });
    return mockCommander;
  },
  parse: (argv) => {
    // ensure that cli-program.js adds the `--help` option:
    expect(argv.length).toBe(3);
    expect(argv[2]).toBe('--help');
    mockpushit({ parse: { argv } });
  },
};
jest.mock('commander', () => mockCommander);

// TBD hackish mock(s) - testing with missing CLI arguments:
process.argv = ['node', './bin/cli.js'];

test('mocked cli-program.js shows help in case of missing args', () => {
  // FUTURE TBD define this kind of a relative path near the beginning
  // of the test script
  require('../../../../../lib/cli-program.js');

  // Using a 1 ms timer to wait for the
  // CLI program func to finish.
  // FUTURE TBD this looks like a bad smell
  // that should be resolved someday.
  return new Promise((resolve) => setTimeout(resolve, 1))
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
