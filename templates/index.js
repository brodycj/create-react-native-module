const android = require('./android')('android');
const ios = require('./ios')('ios');

const general = require('./general');

const updatePlatformInFile = platform => file =>
  Object.assign({}, file, { platform });

module.exports = [].concat(
  general,
  android.map(updatePlatformInFile('android')),
  ios.map(updatePlatformInFile('ios')),
);
