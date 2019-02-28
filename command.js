const emoji = require('node-emoji');

const createLibrary = require('./lib');

module.exports = {
  name: 'create-library',
  description: 'creates a React Native library module for one or more platforms',
  usage: '[options] <name>',
  func: (args, config, options) => {
    const name = args[0];
    const prefix = options.prefix;
    const modulePrefix = options.modulePrefix;
    const packageIdentifier = options.packageIdentifier;
    const platforms = (options.platforms) ? options.platforms.split(',') : options.platforms;
    const overridePrefix = options.overridePrefix;
    const githubAccount = options.githubAccount;
    const authorName = options.authorName;
    const authorEmail = options.authorEmail;
    const license = options.license;
    const view = options.view;
    const generateExample = options.generateExample;

    const beforeCreation = Date.now();
    createLibrary({
      name,
      prefix,
      modulePrefix,
      packageIdentifier,
      platforms,
      overridePrefix,
      githubAccount,
      authorName,
      authorEmail,
      license,
      view,
      generateExample,
    }).then(() => {
      console.log(`
${emoji.get('books')}  Created library module ${name} in \`./${name}\`.
${emoji.get('clock9')}  It took ${Date.now() - beforeCreation}ms.
${emoji.get('arrow_right')}  To get started type \`cd ./${name}\` and run \`npm install\``);
    }).catch((err) => {
      console.error(`Error while creating library module ${name}`);

      if (err.stack) {
        console.error(err.stack);
      }
    });
  },
  options: [{
    command: '--prefix [prefix]',
    description: 'The prefix for the library module (Default: `RN`)',
    default: 'RN',
  }, {
    command: '--override-prefix',
    description: 'Overrides the prefix check and allows the name to begin with uppercase characters',
  }, {
    command: '--module-prefix [modulePrefix]',
    description: 'The module prefix for the library module (Default: `react-native`)',
    default: 'react-native',
  }, {
    command: '--package-identifier [packageIdentifier]',
    description: '(Android only!) The package name for the Android module (Default: `com.reactlibrary`)',
    default: 'com.reactlibrary',
  }, {
    command: '--platforms <platforms>',
    description: 'Platforms the library module will be created for. (comma separated; default: `ios,android`)',
    default: 'ios,android',
  }, {
    command: '--github-account [githubAccount]',
    description: 'The github account where the library module is hosted (Default: `github_account`)',
    default: 'github_account',
  }, {
    command: '--author-name [authorName]',
    description: 'The author\'s name (Default: `Your Name`)',
    default: 'Your Name',
  }, {
    command: '--author-email [authorEmail]',
    description: 'The author\'s email (Default: `yourname@email.com`)',
    default: 'yourname@email.com',
  }, {
    command: '--license [license]',
    description: 'The license type (Default: `Apache-2.0`)',
    default: 'Apache-2.0',
  }, {
    command: '--view',
    description: 'Generate the module as a very simple native view component (Default: `false`)',
  }, {
    command: '--generate-example',
    description: 'Generate an example project and links the library module to it, requires both react-native-cli and yarn to be installed globally (Default: `false`)',
  }]
};
