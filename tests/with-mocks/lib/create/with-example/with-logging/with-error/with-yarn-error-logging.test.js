const lib = require('../../../../../../../lib/lib.js');

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
  readFile: (path, _, cb) => {
    mockpushit({ readFileSyncFromPath: path.replace(/\\/g, '/') });
    cb(null, `{ "name": "x", "scripts": { "test": "exit 1" } }`);
  },
  writeFile: (path, json, options, cb) => {
    mockpushit({
      writeFileToPath: path.replace(/\\/g, '/'),
      json,
      options
    });
    cb();
  },
}));
jest.mock('execa', () => ({
  command: (command, options) => {
    mockpushit({ command, options });
    if (/yarn add/.test(command)) {
      throw new Error('ENOPERM not permitted');
    }
    return Promise.resolve();
  }
}));

// TBD hackish mock:
global.console = {
  info: (...args) => {
    mockpushit({ info: [].concat(args) });
  },
  log: (...args) => {
    mockpushit({ log: [].concat(args) });
  },
  warn: (...args) => {
    mockpushit({ warn: [].concat(args) });
  },
  error: (...args) => {
    mockpushit({ error: [].concat(args) });
  },
};

test('create alice-bobbi module using mocked lib with example, with `yarn add` failure with console logging', async () => {
  const options = {
    platforms: ['android', 'ios'],
    name: 'alice-bobbi',
    generateExample: true,
  };

  let error;
  try {
    // expected to throw:
    await lib(options);
  } catch (e) {
    error = e;
  }
  expect(error).toBeDefined();
  expect(error.message).toMatch(/ENOPERM not permitted/);
  expect(mysnap).toMatchSnapshot();
});
