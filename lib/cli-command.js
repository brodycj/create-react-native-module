const emoji = require('node-emoji');

const normalizedOptions = require('./normalized-options');

const createLibraryModule = require('./lib');

const postCreateInstructions = ({ moduleName, useCocoapods, exampleName }) => {
  return `
====================================================
YOU'RE ALL SET!

To build and run iOS example project, do:
----
cd ${moduleName}/${exampleName}
yarn
${useCocoapods ? `cd ios
pod install
cd ..
`
    : ``}react-native run-ios
----
`;
};

module.exports = {
  name: 'create-library',
  description: 'creates a React Native library module for one or more platforms',
  usage: '[options] <name>',
  func: (args, config, options) => {
    const name = args[0];

    const beforeCreation = Date.now();

    const preNormalizedOptions = Object.assign({}, { name }, options);

    // NOTE: There is a trick where the new normalizedOptions()
    // from normalized-options.js is applied by both command.js & lib.js.
    // This is to ensure that the CLI gets the correct module name for the
    // final log message, and that the exported programmatic
    // function can be completely tested from using the CLI.

    const createOptions = normalizedOptions(preNormalizedOptions);

    const rootModuleName = createOptions.moduleName;

    return createLibraryModule(createOptions).then(() => {
      console.log(`
${emoji.get('books')}  Created library module ${rootModuleName} in \`./${rootModuleName}\`.
${emoji.get('clock9')}  It took ${Date.now() - beforeCreation}ms.
${postCreateInstructions(createOptions)}`);
    }).catch((err) => {
      console.error(`Error while creating library module ${rootModuleName}`);

      if (err.stack) {
        console.error(err.stack);
      }
    });
  },
  options: [{
    command: '--prefix [prefix]',
    description: 'The prefix for the library module',
    default: '',
  }, {
    command: '--module-name [moduleName]',
    description: 'The module library package name to be used in package.json. Default: react-native-(name in param-case)',
  }, {
    command: '--module-prefix [modulePrefix]',
    description: 'The module prefix for the library module, ignored if --module-name is specified',
    default: 'react-native',
  }, {
    command: '--package-identifier [packageIdentifier]',
    description: '[Android] The Java package identifier used by the Android module',
    default: 'com.reactlibrary',
  }, {
    command: '--platforms <platforms>',
    description: 'Platforms the library module will be created for - comma separated',
    default: 'ios,android',
  }, {
    command: '--github-account [githubAccount]',
    description: 'The github account where the library module is hosted',
    default: 'github_account',
  }, {
    command: '--author-name [authorName]',
    description: 'The author\'s name',
    default: 'Your Name',
  }, {
    command: '--author-email [authorEmail]',
    description: 'The author\'s email',
    default: 'yourname@email.com',
  }, {
    command: '--license [license]',
    description: 'The license type',
    default: 'MIT',
  }, {
    command: '--view',
    description: 'Generate the module as a very simple native view component',
  }, {
    command: '--use-cocoapods',
    description: '[iOS] EXPERIMENTAL FEATURE NOT SUPPORTED: Use `AFNetworking` dependency as a sample in the podspec; use it from the iOS code & add `ios/Podfile` to generated example',
  }, {
    command: '--generate-example',
    description: 'Generate an example project and links the library module to it, requires both react-native-cli and yarn to be installed globally',
  }, {
    command: '--example-name [exampleName]',
    description: 'Name for the example project',
    default: 'example',
  }, {
    command: '--example-react-native-version [exampleReactNativeVersion]',
    description: 'React Native version for the generated example project',
    default: 'react-native@0.59',
  }]
};
