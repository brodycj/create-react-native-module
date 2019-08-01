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
  },
  jsonfile: { // FUTURE TBD may be combined with fs object above
    readFileSync: (jsonFilePath) => {
      mysnap.push({
        call: 'jsonfile.readFileSync',
        jsonFilePath,
      });
      return {
        name: 'example',
        scripts: {
          test: 'echo "not implemented" && exit 1'
        }
      };
    },
    writeFileSync: (path, json, options) => {
      mysnap.push({
        call: 'jsonfile.writeFileSync',
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
