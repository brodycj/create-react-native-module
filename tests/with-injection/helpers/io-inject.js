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
    readFileSync: (jsonFilePath) => {
      mysnap.push({
        call: 'fs.readFileSync',
        jsonFilePath: jsonFilePath.replace(/\\/g, '/'),
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
        filePath: path.replace(/\\/g, '/'),
        json,
        options,
      });
    },
  },
  execa: {
    commandSync: (command, options) => {
      mysnap.push(
        `* execa.commandSync command: ${command} options: ${JSON.stringify(options)}\n`);
    },
  },
});
