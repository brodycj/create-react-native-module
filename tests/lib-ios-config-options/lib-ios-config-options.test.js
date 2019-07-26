const lib = require('../../lib/lib.js')

const ioMocks = require('../helpers/io-mocks.js')

test('create alice-bobbi module with config options for iOS only', () => {
  const mysnap = []

  const mocks = ioMocks(mysnap)

  const options = {
    platforms: ['ios'],
    name: 'alice-bobbi',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    fs: mocks.fs,
  }

  return lib(options).then(() => {
    expect(mysnap).toMatchSnapshot()
  })
})
