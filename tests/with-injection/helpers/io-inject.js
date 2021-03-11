const mycwd = require('process').cwd();

module.exports = (mysnap) => ({
  fs: {
    outputFile: (name, content) => {
      mysnap.push(
        `* outputFile name: ${name.replace(mycwd, '...').replace(/\\/g, '/')}
content:
--------
${content}
<<<<<<<< ======== >>>>>>>>
`);

      return Promise.resolve();
    },

    ensureDir: (dir) => {
      mysnap.push(`* ensureDir dir: ${dir.replace(mycwd, '...').replace(/\\/g, '/')}\n`);
      return Promise.resolve();
    },
    readFileSync: (jsonFilePath) => {
      mysnap.push({
        call: 'fs.readFileSync',
        jsonFilePath: jsonFilePath.replace(mycwd, '...').replace(/\\/g, '/'),
      });
      return `{
  "name": "example",
  "scripts": {
    "test": "echo 'not implemented' && exit 1"
  }
}`;
    },
    writeFileSync: (path, json, options) => {
      mysnap.push({
        call: 'fs.writeFileSync',
        filePath: path.replace(mycwd, '...').replace(/\\/g, '/'),
        json,
        options,
      });
    },
  },
  execa: {
    commandSync: (command, opts) => {
      const options = { ...opts, ...(opts.cwd ? { cwd: opts.cwd.replace(mycwd, '...').replace(/\\/g, '/') } : {}) };
      mysnap.push(
        `* execa.commandSync command: ${command} options: ${JSON.stringify(options)}\n`);
    },
  },
  reactNativeInit: (projectNameArray, opts) => {
    const options = { ...opts, ...(opts.directory ? { directory: opts.directory.replace(/\\/g, '/') } : {}) };
    mysnap.push({ call: 'reactNativeInit', nameArray: projectNameArray, options });
  }
});
