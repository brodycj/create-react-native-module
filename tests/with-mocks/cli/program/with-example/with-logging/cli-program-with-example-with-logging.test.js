// special compact mocks for this test:
const mysnap = [];
const mockpushit = x => mysnap.push(x);
jest.mock('please-upgrade-node', () => ({ name, engines }) => {
  // only snapshot a limited number of fields
  expect(name).toBeDefined();
  expect(engines).toBeDefined();
  mockpushit({ 'please-upgrade-node': { name, engines } });
});
jest.mock('update-notifier', () => ({ pkg }) => {
  // only check a limited number of fields in pkg
  expect(pkg.name).toBeDefined();
  expect(pkg.version).toBeDefined();
  return { notify: () => mockpushit({ notify: {} }) };
});
jest.mock('fs-extra', () => ({
  outputFile: (outputFileName, theContent) => {
    mockpushit({
      outputFileName: outputFileName.replace(/\\/g, '/'),
      theContent
    });
    return Promise.resolve();
  },
  ensureDir: (dir) => {
    mockpushit({ ensureDir: dir.replace(/\\/g, '/') });
    return Promise.resolve();
  },
}));
const mockCommanderState = { actionFunction: null };
const mockOptions = { platforms: 'android,ios', generateExample: true };
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
      // inject results of parsing args here:
      { opts: () => mockOptions },
      [{ bogus: {} }, ['test-package']]
    );
  },
  help: () => {
    throw new Error('help call not expected in this test');
  },
};
jest.mock('commander', () => mockCommander);
jest.mock('execa', () => ({
  commandSync: (command, options) => {
    mockpushit({ commandSync: command, options });
  }
}));
jest.mock('console', () => ({
  info: (...args) => {
    mockpushit({
      // TBD EXTRA WORKAROUND HACK for non-deterministic elapsed time in log
      info: args.map(line => line.replace(/It took.*s/g, 'It took XXX'))
    });
  },
  // console.log is no longer expected
  // log: (...args) => ...
  warn: (...args) => {
    mockpushit({ warn: [].concat(args) });
  },
  error: (...args) => {
    throw new Error('console error not expected');
  },
}));

// TBD hackish injection
// (NOTE that the results of parsing the args is injected above)
process.argv = ['node', 'create-cli.js', 'test-package'];

test('mocked cli-program.js runs correctly with example, with logging', () => {
  require('../../../../../../lib/cli-program.js');
  // Using a 1 ms timer to wait for the
  // CLI program func to finish.
  // FUTURE TBD this looks like a bad smell
  // that should be resolved someday.
  return new Promise((resolve) => setTimeout(resolve, 1))
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
