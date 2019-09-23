module.exports = (mysnap) => ({
  fs: {
    outputFile: (name, content) => {
      mysnap.push(
        `* outputFile name: ${name.replace(/\\/g, '/')}
content:
--------
${content}
<<<<<<<< ======== >>>>>>>>
`);

      return Promise.resolve();
    },

    ensureDir: (dir) => {
      mysnap.push(`* ensureDir dir: ${dir.replace(/\\/g, '/')}\n`);
      return Promise.resolve();
    },
    readFile: (jsonFilePath, _, cb) => {
      mysnap.push({
        call: 'fs.readFile',
        jsonFilePath: jsonFilePath.replace(/\\/g, '/'),
      });
      return cb(null, `{
  "name": "example",
  "scripts": {
    "test": "echo 'not implemented' && exit 1"
  }
}`);
    },
    writeFileSync: (path, json, options) => {
      mysnap.push({
        call: 'fs.writeFileSync',
        filePath: path.replace(/\\/g, '/'),
        json,
        options,
      });
    },
  },
  execa: {
    command: (command, options) => {
      mysnap.push(
        `* execa.command command: ${command} options: ${JSON.stringify(options)}\n`);
      return Promise.resolve();
    },
  },
});
