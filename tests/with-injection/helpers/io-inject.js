const process = require('process');

module.exports = (mysnap) => ({
  fs: {
    outputFile: (name, content) => {
      mysnap.push(
        `* outputFile name: ${name.replace(/\\/g, '/').replace(process.cwd(), '...')}
content:
--------
${content}
<<<<<<<< ======== >>>>>>>>
`);

      return Promise.resolve();
    },

    ensureDir: (dir) => {
      mysnap.push(`* ensureDir dir: ${dir.replace(/\\/g, '/').replace(process.cwd(), '...')}\n`);
      return Promise.resolve();
    },
    readFileSync: (jsonFilePath) => {
      mysnap.push({
        call: 'fs.readFileSync',
        jsonFilePath: jsonFilePath.replace(/\\/g, '/').replace(process.cwd(), '...'),
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
        filePath: path.replace(/\\/g, '/').replace(process.cwd(), '...'),
        json,
        options,
      });
    },
  },
  execa: {
    commandSync: (command, opts) => {
      const options = { ...opts, ...(opts.cwd ? { cwd: opts.cwd.replace(process.cwd(), '...') } : {}) };
      mysnap.push(
        `* execa.commandSync command: ${command} options: ${JSON.stringify(options)}\n`);
    },
  },
});
