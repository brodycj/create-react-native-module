const action = require('../../../../../../../../lib/cli-command.js').action;

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
    mockpushit({ error: [].concat(args) });
  },
}));

test(`create alice-bobbi module with logging, with platforms: 'bogus'`, async () => {
  const args = ['alice-bobbi'];

  const options = { platforms: 'bogus' };

  await action(args, options);

  expect(mysnap).toMatchSnapshot();
});
