module.exports = (mysnap) => ({
  fs: {
    outputFile: (name, content) => {
      mysnap.push(
        `* outputFile name: ${name}
content:
--------
${content}
<<<<<<<< ======== >>>>>>>>
`);

      return Promise.resolve();
    },

    ensureDir: (dir) => {
      mysnap.push(`* ensureDir dir: ${dir}\n`);
      return Promise.resolve();
    },
    readFileSync: (jsonFilePath) => {
      mysnap.push({
        call: 'fs.readFileSync',
        jsonFilePath,
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
        filePath: path,
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
