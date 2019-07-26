const android = require('./android')
const ios = require('./ios')
const windows = require('./windows')('windows')

const general = require('./general')

const updatePlatformInFile = platform => file =>
  Object.assign({}, file, { platform })

module.exports = [].concat(
  general,
  android.map(updatePlatformInFile('android')),
  ios.map(updatePlatformInFile('ios')),
  windows.map(updatePlatformInFile('windows')),
)
