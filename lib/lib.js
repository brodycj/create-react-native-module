// Node.js built-in:

const path = require('path');

// External imports:

// default execa object
const execaDefault = require('execa');

// default fs object
const fsExtra = require('fs-extra');

const jsonfile = require('jsonfile');

// Internal imports:

const normalizedOptions = require('./normalized-options');

// Imports from templates

const templates = require('../templates');
const exampleTemplates = require('../templates/example');

const DEFAULT_PACKAGE_IDENTIFIER = 'com.reactlibrary';
const DEFAULT_PLATFORMS = ['android', 'ios'];
const DEFAULT_GITHUB_ACCOUNT = 'github_account';
const DEFAULT_AUTHOR_NAME = 'Your Name';
const DEFAULT_AUTHOR_EMAIL = 'yourname@email.com';
const DEFAULT_LICENSE = 'MIT';
const DEFAULT_USE_COCOAPODS = false;
const DEFAULT_GENERATE_EXAMPLE = false;
const DEFAULT_EXAMPLE_NAME = 'example';
const DEFAULT_EXAMPLE_REACT_NATIVE_VERSION = 'react-native@0.59';

const renderTemplateIfValid = (fs, root, template, templateArgs) => {
  // avoid throwing an exception in case there is no valid template.name member
  const name = !!template.name && template.name(templateArgs);
  if (!name) return Promise.resolve();

  const filename = path.join(root, name);
  const [baseDir] = filename.split(path.basename(filename));

  return fs.ensureDir(baseDir).then(() =>
    fs.outputFile(filename, template.content(templateArgs))
  );
};

// FUTURE TBD make this asynchronous and possibly more functional:
const npmAddScriptSync = (packageJsonPath, script, fs) => {
  try {
    var packageJson = jsonfile.readFileSync(packageJsonPath, { fs });
    if (!packageJson.scripts) packageJson.scripts = {};
    packageJson.scripts[script.key] = script.value;
    jsonfile.writeFileSync(packageJsonPath, packageJson, { fs, spaces: 2 });
  } catch (e) {
    if (/ENOENT.*package.json/.test(e.message)) {
      throw new Error(`The package.json at path: ${packageJsonPath} does not exist.`);
    } else {
      throw e;
    }
  }
};

const generateWithNormalizedOptions = ({
  name,
  prefix,
  moduleName,
  className,
  modulePrefix,
  packageIdentifier = DEFAULT_PACKAGE_IDENTIFIER,
  namespace,
  platforms = DEFAULT_PLATFORMS,
  githubAccount = DEFAULT_GITHUB_ACCOUNT,
  authorName = DEFAULT_AUTHOR_NAME,
  authorEmail = DEFAULT_AUTHOR_EMAIL,
  license = DEFAULT_LICENSE,
  view = false,
  useCocoapods = DEFAULT_USE_COCOAPODS,
  generateExample = DEFAULT_GENERATE_EXAMPLE,
  exampleName = DEFAULT_EXAMPLE_NAME,
  exampleReactNativeVersion = DEFAULT_EXAMPLE_REACT_NATIVE_VERSION,
}, {
  fs = fsExtra, // (this can be mocked out for testing purposes)
  execa = execaDefault, // (this can be mocked out for testing purposes)
}) => {
  if (packageIdentifier === DEFAULT_PACKAGE_IDENTIFIER) {
    console.warn(`While \`{DEFAULT_PACKAGE_IDENTIFIER}\` is the default package
      identifier, it is recommended to customize the package identifier.`);
  }

  // Note that the some of these console log messages are done as
  // console.info instead of verbose since they are needed to help
  // make sense of the console output from the third-party tools.

  console.info(
    `CREATE new React Native module with the following options:

  root moduleName: ${moduleName}
  name: ${name}
  prefix: ${prefix}
  modulePrefix: ${modulePrefix}
  packageIdentifier: ${packageIdentifier}
  platforms: ${platforms}
  githubAccount: ${githubAccount}
  authorName: ${authorName}
  authorEmail: ${authorEmail}
  license: ${license}
  view: ${view}
  useCocoapods: ${useCocoapods}
  generateExample: ${generateExample}
  exampleName: ${exampleName}
  `);

  // QUICK LOCAL INJECTION overwite of existing execSync / commandSync call from
  // mockable execa object for now (at least):
  const commandSync = execa.commandSync;

  if (generateExample) {
    const reactNativeVersionCommand = 'react-native --version';
    const yarnVersionCommand = 'yarn --version';

    const checkCliOptions = { stdio: 'inherit' };
    const errorRemedyMessage = 'both react-native-cli and yarn CLI tools are needed to generate example project';

    try {
      console.info('CREATE: Check for valid react-native-cli tool version, as needed to generate the example project');
      commandSync(reactNativeVersionCommand, checkCliOptions);
      console.info(`${reactNativeVersionCommand} ok`);
    } catch (e) {
      throw new Error(
        `${reactNativeVersionCommand} failed; ${errorRemedyMessage}`);
    }

    try {
      console.info('CREATE: Check for valid Yarn CLI tool version, as needed to generate the example project');
      commandSync(yarnVersionCommand, checkCliOptions);
      console.info(`${yarnVersionCommand} ok`);
    } catch (e) {
      throw new Error(
        `${yarnVersionCommand} failed; ${errorRemedyMessage}`);
    }
  }

  console.info('CREATE: Generating the React Native library module');

  const generateLibraryModule = () => {
    return fs.ensureDir(moduleName).then(() => {
      return Promise.all(templates.filter((template) => {
        if (template.platform) {
          return (platforms.indexOf(template.platform) >= 0);
        }

        return true;
      }).map((template) => {
        const templateArgs = {
          name: className,
          moduleName,
          packageIdentifier,
          namespace,
          platforms,
          githubAccount,
          authorName,
          authorEmail,
          license,
          view,
          useCocoapods,
          generateExample,
          exampleName,
        };

        return renderTemplateIfValid(fs, moduleName, template, templateArgs);
      }));
    });
  };

  // This separate promise makes it easier to generate
  // multiple test or sample apps in the future.
  const generateExampleApp =
    () => {
      const exampleReactNativeInitCommand =
        `react-native init ${exampleName} --version ${exampleReactNativeVersion}`;

      console.info(
        `CREATE example app with the following command: ${exampleReactNativeInitCommand}`);

      const execOptions = { cwd: `./${moduleName}`, stdio: 'inherit' };

      // (with the work done in a promise chain)
      return Promise.resolve()
        .then(() => {
          // We use synchronous execSync / commandSync call here
          // which is able to output its stdout to stdout in this process.
          // Note that any exception would be properly handled since this
          // call is executed within a Promise.resolve().then() callback.
          commandSync(exampleReactNativeInitCommand, execOptions);
        })
        .then(() => {
          // Render the example template
          const templateArgs = {
            name: className,
            moduleName,
            view,
            useCocoapods,
            exampleName,
          };

          return Promise.all(
            exampleTemplates.map((template) => {
              return renderTemplateIfValid(fs, moduleName, template, templateArgs);
            })
          );
        })
        .then(() => {
          // Adds and link the new library
          return new Promise((resolve, reject) => {
            // Add postinstall script to the example package.json
            console.info('Adding cleanup postinstall task to the example app');
            const pathExampleApp = `./${moduleName}/${exampleName}`;
            npmAddScriptSync(`${pathExampleApp}/package.json`, {
              key: 'postinstall',
              value: `node ../scripts/examples_postinstall.js`
            }, fs);

            // Add and link the new library
            console.info('Linking the new module library to the example app');
            const addLinkLibraryOptions = { cwd: pathExampleApp, stdio: 'inherit' };
            try {
              commandSync('yarn add file:../', addLinkLibraryOptions);
            } catch (e) {
              console.error('Yarn failure for example, aborting');
              throw (e);
            }
            commandSync('react-native link', addLinkLibraryOptions);

            return resolve();
          });
        });
    };

  return generateLibraryModule().then(() => {
    return (generateExample
      ? generateExampleApp()
      : Promise.resolve()
    );
  });
};

// lib function that acccepts options argument and optionally
// a hidden ioImports object argument which is
// mockable, unstable, and not documented
module.exports = function lib (options) {
  // get hidden ioImports object argument if available
  const ioImports = (arguments.length > 1)
    ? arguments[1]
    : {};

  return generateWithNormalizedOptions(
    normalizedOptions(options),
    ioImports);
};
