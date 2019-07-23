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
});
