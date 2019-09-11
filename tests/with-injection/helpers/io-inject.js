module.exports = (mysnap) => ({
  fs: {
    outputFile: (name, content) => {
      mysnap.push({
        outputFileWithName: name,
        content
      });
      return Promise.resolve();
    },
    ensureDir: (dir) => {
      mysnap.push({ ensureDir: dir });
      return Promise.resolve();
    },
    readFileSync: (jsonFilePath) => {
      mysnap.push({ readFileSyncFromPath: jsonFilePath });
      return `{
  "name": "example",
  "scripts": {
    "test": "echo 'not implemented' && exit 1"
  }
}`;
    },
    writeFileSync: (path, json, options) => {
      mysnap.push({
        writeFileSyncToPath: path,
        json,
        options,
      });
    },
  },
  execa: {
    commandSync: (command, options) => {
      mysnap.push({ commandSync: command, options });
    },
  },
});
