const emoji = require('node-emoji');

const logSymbols = require('log-symbols');

const normalizedOptions = require('./normalized-options');

const createLibraryModule = require('./lib');

const postCreateInstructions = ({
  moduleName,
  platforms,
  generateExample,
  exampleName
}) => `
====================================================
YOU'RE ALL SET!
` + (generateExample
    ? `
${emoji.get('bulb')} check out the example app in ${moduleName}/${exampleName}
${emoji.get('bulb')} recommended: run Metro Bundler in a new shell
${logSymbols.info} (cd ${moduleName}/${exampleName} && yarn start)
${emoji.get('bulb')} enter the following commands to run the example app:
${logSymbols.info} cd ${moduleName}/${exampleName}
${platforms.split(',').map(platform =>
  `${logSymbols.info} react-native run-${platform}`
).join(`
`)}
${logSymbols.warning} IMPORTANT NOTICES
${logSymbols.warning} After clean checkout, these first steps are needed:
${logSymbols.info} run Yarn in ${moduleName}/${exampleName}/ios
${logSymbols.info} (cd ${moduleName}/${exampleName} && yarn)
${logSymbols.info} do \`pod install\` for iOS in ${moduleName}/${exampleName}/ios
${logSymbols.info} cd ${moduleName}/${exampleName}
${logSymbols.info} (cd ios && pod install)
${logSymbols.warning} KNOWN ISSUE with adding dependencies to the library root
${logSymbols.info} see https://github.com/brodybits/create-react-native-module/issues/308
`
    : `
${emoji.get('bulb')} next time consider using \`--generate-example\` to add a generated example!
`);

module.exports = {
  name: 'create-library',
  description: 'creates a React Native library module for one or more platforms',
  usage: '[options] <name>',
  action: (args, options) => {
    if (!args || args.length < 1) {
      throw new Error('missing lib module name');
    }

    if (args.length > 1) {
      throw new Error('too many arguments');
    }

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
    description: 'The prefix of the library module object to be exported by both JavaScript and native code',
    default: '',
  }, {
    command: '--module-name [moduleName]',
    description: 'The module library package name to be used in package.json. Default: react-native-(name in param-case)',
  }, {
    command: '--module-prefix [modulePrefix]',
    description: 'The prefix of the library module object, ignored if --module-name is specified',
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
    command: '--tvos-enabled',
    description: 'Generate the module with tvOS build enabled (requires react-native-tvos fork, with minimum version of 0.60, and iOS platform to be enabled)',
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
    command: '--use-apple-networking',
    description: '[iOS] Use `AFNetworking` dependency as a sample in the podspec & use it from the iOS code',
  }, {
    command: '--generate-example',
    description: 'Generate an example project and add the library module to it with symlink by defult, with overwrite of example metro.config.js to add workaround for Metro symlink issue - requires both react-native-cli and yarn to be installed globally',
  }, {
    command: '--example-file-linkage',
    description: "DEPRECATED: do `yarn add file:../` instead of `yarn add link:../` in a generated example project, and add a postinstall workaround script, with no overwrite of example metro.config.js",
  }, {
    command: '--example-name [exampleName]',
    description: 'Name for the example project',
    default: 'example',
  }, {
    command: '--example-react-native-version [exampleReactNativeVersion]',
    description: 'React Native version for the generated example project',
    default: 'react-native@latest',
  }, {
    command: '--write-example-podfile',
    description: '[iOS] EXPERIMENTAL FEATURE NOT SUPPORTED: write (or overwrite) example ios/Podfile',
  }]
};
