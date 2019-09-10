module.exports = (mysnap) => ({
  fsPromises: {
    writeFile: (name, content) => {
      mysnap.push(
        `* writeFile name: ${name}
content:
--------
${content}
<<<<<<<< ======== >>>>>>>>
`);

      return Promise.resolve();
    },

    mkdir: (dir, opts) => {
      mysnap.push(`* mkdir dir: ${dir} opts: ${JSON.stringify(opts)}\n`);
      return Promise.resolve();
    },
  },
  fsGraceful: {
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
