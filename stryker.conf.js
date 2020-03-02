module.exports = config => {
  config.set({
    mutator: 'javascript',
    mutate: ['lib/**/*.js', 'templates/**/*.js', 'unsupported-platforms/**/*.js'],
    packageManager: 'yarn',
    reporters: ['html', 'clear-text', 'progress'],
    testRunner: 'jest',
    transpilers: [],
    coverageAnalysis: 'off'
  });
};
