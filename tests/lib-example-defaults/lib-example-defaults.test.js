const lib = require('../../lib/lib.js')

const ioMocks = require('../helpers/io-mocks.js')

test('create alice-bobbi module with defaults', () => {
  const mysnap = []

  const mocks = ioMocks(mysnap)

  const options = {
    name: 'alice-bobbi',
    generateExample: true,
    fs: mocks.fs,
    execa: mocks.execa,
    jsonfile: mocks.jsonfile,
  }

  return lib(options).then(() => {
    expect(mysnap).toMatchSnapshot()
  })
})
