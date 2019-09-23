const func = require('../../../../../../../../lib/cli-command.js').func;

// special compact mocks for this test:
const mysnap = [];
const mockpushit = x => mysnap.push(x);
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

// TBD hackish mock:
global.console = {
  info: (...args) => {
    mockpushit({ info: [].concat(args) });
  },
  log: (...args) => {
    mockpushit({
      // TBD EXTRA WORKAROUND HACK for non-deterministic elapsed time in log
      log: args.map(line => line.replace(/It took.*s/g, 'It took XXX'))
    });
  },
  warn: (...args) => {
    mockpushit({ warn: [].concat(args) });
  },
};

test(`create alice-bobbi module with logging, with platforms: 'bogus'`, async () => {
  const args = ['alice-bobbi'];

  const options = { platforms: 'bogus' };

  func(args, null, options);

  // Using a 1 ms timer to wait for the
  // CLI command function to finish.
  // FUTURE TBD this looks like a bad smell
  // that should be resolved someday.
  await new Promise((resolve) => setTimeout(resolve, 1));

  expect(mysnap).toMatchSnapshot();
});
