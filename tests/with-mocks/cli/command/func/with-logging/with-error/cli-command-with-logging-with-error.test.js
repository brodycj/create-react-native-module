const func = require('../../../../../../../lib/cli-command.js').func;

// special compact mocks for this test:
const mysnap = [];
const mockpushit = x => mysnap.push(x);
jest.mock('fs-extra', () => ({
  ensureDir: (dir) => {
    mockpushit({ ensureDir: dir });
    return Promise.reject(new Error(`ENOPERM not permitted`));
  },
  outputFile: (outputFileName, theContent) => {
    // NOT EXPECTED:
    mockpushit({ outputFileName, theContent });
    return Promise.reject(new Error(`ENOPERM not permitted`));
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
  error: (first, ...rest) => {
    mockpushit({
      error: [].concat(
        [].concat(
          first
            // Check trace with relative path
            // THANKS for guidance:
            // * https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string/1145525#1145525
            // * https://github.com/tunnckoCore/clean-stacktrace-relative-paths/blob/v1.0.4/index.js#L59
            .split(process.cwd()).join('...')
            // IGNORE test-dependant trace info
            .split(/at.*JestTest/)[0]
            // IGNORE line number in cli-command.js
            // in order to avoid sensitivity to mutation testing
            // (miss potentially surviving mutants)
            .replace(/cli-command.js:.*/, 'cli-command.js:...')
            // WORKAROUND for Windows:
            .replace(/\\/g, '/')
        ),
        rest
      )
    });
  },
};

test('create alice-bobbi module with logging, with fs error (with defaults for Android & iOS)', async () => {
  const args = ['alice-bobbi'];

  const config = 'bogus';

  await func(args, config, {});

  expect(mysnap).toMatchSnapshot();
});
