const lib = require('../../lib/lib.js')

const ioMocks = require('../helpers/io-mocks.js')

test('create alice-bobbi module with defaults', () => {
  const mysnap = []

  const mocks = ioMocks(mysnap)

  const options = {
    name: 'alice-bobbi',
    fs: mocks.fs,
  }

  return lib(options).then(() => {
    expect(mysnap).toMatchSnapshot()
  })
})
