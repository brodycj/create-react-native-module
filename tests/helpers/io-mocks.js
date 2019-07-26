module.exports = mysnap => ({
  fs: {
    outputFile: (name, content) => {
      mysnap.push(
        `* outputFile name: ${name}
content:
--------
${content}
<<<<<<<< ======== >>>>>>>>
`
      )

      return Promise.resolve()
    },

    ensureDir: dir => {
      mysnap.push(`* ensureDir dir: ${dir}\n`)
      return Promise.resolve()
    },
  },
  execa: {
    commandSync: (command, options) => {
      mysnap.push(
        `* execa.commandSync command: ${command} options: ${JSON.stringify(options)}\n`
      )
    },
  },
  jsonfile: {
    readFileSync: jsonPath => {
      mysnap.push(`* jsonfile.readFileSync jsonPath: ${jsonPath}\n`)
      return { name: 'bogus', scripts: [] }
    },
    writeFileSync: (path, json, options) => {
      mysnap.push(
        `* jsonfile.writeFileSync path: ${path} json ${JSON.stringify(
          json
        )} options ${JSON.stringify(options)}\n`
      )
    },
  },
})
