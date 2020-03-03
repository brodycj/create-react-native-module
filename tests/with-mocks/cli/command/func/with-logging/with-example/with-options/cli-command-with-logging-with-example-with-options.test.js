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
  readFileSync: (path) => {
    mockpushit({ readFileSyncFromPath: path.replace(/\\/g, '/') });
    return `{ "name": "x", "scripts": { "test": "exit 1" } }`;
  },
  writeFileSync: (path, json, options) => {
    mockpushit({
      writeFileSyncToPath: path.replace(/\\/g, '/'),
      json,
      options
    });
  },
}));
jest.mock('execa', () => ({
  commandSync: (command, options) => {
    mockpushit({ commandSync: command, options });
  }
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

test(`create alice-bobbi module with logging, with example, with options`, async () => {
  const args = ['alice-bobbi'];

  const options = {
    platforms: 'android,ios',
    name: 'alice-bobbi',
    prefix: 'ABC',
    packageIdentifier: 'com.alicebits',
    tvosEnabled: true,
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    generateExample: true,
  };


  await func(args, null, options);

  expect(mysnap).toMatchSnapshot();
});
