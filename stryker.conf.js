module.exports = config => {
  config.set({
    mutator: 'javascript',
    mutate: ['lib/**/*.js', 'templates/**/*.js'],
    packageManager: 'yarn',
    reporters: ['html', 'clear-text', 'progress'],
    testRunner: 'jest',
    transpilers: [],
    coverageAnalysis: 'off'
  });
};
