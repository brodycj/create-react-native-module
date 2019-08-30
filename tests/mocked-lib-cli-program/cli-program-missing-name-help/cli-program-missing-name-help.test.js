// special compact mocks for this test:
const mysnap = [];
const mockpushit = x => mysnap.push(x);
jest.mock('update-notifier', () => ({ pkg }) => {
  // only check a limited number of fields in pkg
  expect(pkg.name).toBeDefined();
  expect(pkg.version).toBeDefined();
  return { notify: () => mockpushit({ notify: {} }) };
});
jest.mock('fs-extra', () => ({
  outputFile: (outputFileName, theContent) => {
    mockpushit({ outputFileName, theContent });
    return Promise.resolve();
  },
  ensureDir: (dir) => {
    mockpushit({ ensureDir: dir });
    return Promise.resolve();
  },
}));
const mockCommanderState = { actionFunction: null };
const mockCommander = {
  args: [],
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
  action: (actionFunction) => {
    mockpushit({ action: { actionFunction } });
    mockCommanderState.actionFunction = actionFunction;
    return mockCommander;
  },
  option: (...args) => {
    mockpushit({ option: { args } });
    return mockCommander;
  },
  parse: (argv) => {
    mockpushit({ parse: { argv } });
    mockCommanderState.actionFunction.apply(
      { opts: () => ({ platforms: 'android,ios' }) },
      []);
  },
  help: () => {
    mockpushit({ help: {} });
  },
};
jest.mock('commander', () => mockCommander);

// TBD hackish mock(s):
process.argv = ['node', 'create-cli.js'];

test('mocked cli-program.js runs correctly defaults', () => {
  require('../../../lib/cli-program.js');
  // Using a 1 ms timer to wait for the
  // CLI program func to finish.
  // FUTURE TBD this looks like a bad smell
  // that should be resolved someday.
  return new Promise((resolve) => setTimeout(resolve, 1))
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
