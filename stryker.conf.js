module.exports = config => {
  config.set({
    mutator: 'javascript',
    mutate: [
      // TBD there seems to be an issue with
      // Stryker mutation testing on
      // bin/*.js  (...)
      // 'bin/**/*.js',
      'lib/**/*.js',
      'templates/**/*.js',
      'unsupported-platforms/**/*.js'
    ],
    packageManager: 'yarn',
    reporters: [
      'html',
      'clear-text',
      'progress'
    ],
    testRunner: 'jest',
    transpilers: [],
    coverageAnalysis: 'off'
  });
};
