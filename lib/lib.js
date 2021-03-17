// Node.js built-in:

const path = require('path');

// External imports:

const { info, warn, error } = require('console');

// default execa object
const execaDefault = require('execa');

// default fs object
const fsExtra = require('fs-extra');

const jsonfile = require('jsonfile');

// default reactNativeInit function
const reactNativeInitDefault = require('react-native-init-func');

// Internal imports:

const normalizedOptions = require('./normalized-options');

// Imports from templates

const templates = require('../templates');
const exampleTemplates = require('../templates/example');

const DEFAULT_NATIVE_PACKAGE_ID = 'com.reactlibrary';
const DEFAULT_PLATFORMS = ['android', 'ios'];
const DEFAULT_GITHUB_ACCOUNT = 'github_account';
const DEFAULT_AUTHOR_NAME = 'Your Name';
const DEFAULT_AUTHOR_EMAIL = 'yourname@email.com';
const DEFAULT_LICENSE = 'MIT';
const DEFAULT_GENERATE_EXAMPLE = false;
const DEFAULT_EXAMPLE_NAME = 'example';
const DEFAULT_EXAMPLE_REACT_NATIVE_TEMPLATE = 'react-native@latest';

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
  packageName,
  objectClassName,
  nativePackageId = DEFAULT_NATIVE_PACKAGE_ID,
  // namespace - library API member removed since Windows platform
  // is now removed (may be added back someday in the future)
  // namespace,
  platforms = DEFAULT_PLATFORMS,
  tvosEnabled = false,
  githubAccount = DEFAULT_GITHUB_ACCOUNT,
  authorName = DEFAULT_AUTHOR_NAME,
  authorEmail = DEFAULT_AUTHOR_EMAIL,
  license = DEFAULT_LICENSE,
  view = false,
  useAppleNetworking = false,
  generateExample = DEFAULT_GENERATE_EXAMPLE,
  exampleFileLinkage = false,
  exampleName = DEFAULT_EXAMPLE_NAME,
  exampleReactNativeTemplate = DEFAULT_EXAMPLE_REACT_NATIVE_TEMPLATE,
  writeExamplePodfile = false,
}, {
  fs = fsExtra, // (this can be mocked out for testing purposes)
  execa = execaDefault, // (this can be mocked out for testing purposes)
  reactNativeInit = reactNativeInitDefault // (can be overridden or mocked out for testing purposes)
}) => {
  if (nativePackageId === DEFAULT_NATIVE_PACKAGE_ID) {
    warn(`While \`{DEFAULT_NATIVE_PACKAGE_ID}\` is the default package
      identifier, it is recommended to customize the package identifier.`);
  }

  // Note that the some of these console log messages are logged as
  // info instead of verbose since they are needed to help
  // make sense of the console output from the third-party tools.

  info(
    `CREATE new React Native module with the following options:

                        name: ${name}
           full package name: ${packageName}
                     is view: ${view}
           object class name: ${objectClassName}
     Android nativePackageId: ${nativePackageId}
                   platforms: ${platforms}
           Apple tvosEnabled: ${tvosEnabled}
                  authorName: ${authorName}
                 authorEmail: ${authorEmail}
        author githubAccount: ${githubAccount}
                     license: ${license}
          useAppleNetworking: ${useAppleNetworking}
` + (generateExample
      ? `
             generateExample: ${generateExample}
          exampleFileLinkage: ${exampleFileLinkage}
                 exampleName: ${exampleName}
  exampleReactNativeTemplate: ${exampleReactNativeTemplate}
         writeExamplePodfile: ${writeExamplePodfile}
` : ``));

  // QUICK LOCAL INJECTION overwite of existing execSync / commandSync call from
  // mockable execa object for now (at least):
  const commandSync = execa.commandSync;

  if (generateExample) {
    const yarnVersionCommand = 'yarn --version';
    const checkCliOptions = { stdio: 'inherit' };
    const errorRemedyMessage = 'yarn CLI is needed to generate example project';

    try {
      info('CREATE: Check for valid Yarn CLI tool version, as needed to generate the example project');
      commandSync(yarnVersionCommand, checkCliOptions);
      info(`${yarnVersionCommand} ok`);
    } catch (e) {
      throw new Error(`${yarnVersionCommand} failed ... ${errorRemedyMessage}`);
    }

    // NOTE: While the pod tool is also required for example on iOS,
    // react-native CLI will help the user install this tool if needed.
  }

  info('CREATE: Generating the React Native library module');

  const generateLibraryModule = () => {
    return fs.ensureDir(packageName).then(() => {
      return Promise.all(templates.filter((template) => {
        if (template.platform) {
          return (platforms.indexOf(template.platform) >= 0);
        }

        return true;
      }).map((template) => {
        const templateArgs = {
          packageName,
          objectClassName,
          nativePackageId,
          // namespace - library API member removed since Windows platform
          // is now removed (may be added back someday in the future)
          // namespace,
          platforms,
          tvosEnabled,
          githubAccount,
          authorName,
          authorEmail,
          license,
          view,
          useAppleNetworking,
        };

        return renderTemplateIfValid(fs, packageName, template, templateArgs);
      }));
    });
  };

  // This separate promise makes it easier to generate
  // multiple test or sample apps in the future.
  const generateExampleApp =
    () => {
      info(`CREATE example app with the following template: ${exampleReactNativeTemplate}`);

      // resolve **absolute** module & example paths before
      // react-native-init-func function call
      // which may affect the process cwd state
      // (absolute paths seem to be needed for the steps below function properly)
      const modulePath = path.resolve('.', packageName);
      const pathExampleApp = path.join(modulePath, exampleName);
      const exampleAppSubdirectory = path.join('.', packageName, exampleName);

      // (with the work done in a promise chain)
      return Promise.resolve()
        .then(() => {
          return reactNativeInit([exampleName], {
            template: exampleReactNativeTemplate,
            directory: exampleAppSubdirectory
          });
        })
        .then(() => {
          // Render the example template
          const templateArgs = {
            packageName,
            objectClassName,
            view,
            exampleFileLinkage,
            exampleName,
            writeExamplePodfile,
          };

          return Promise.all(
            exampleTemplates.map((template) => {
              return renderTemplateIfValid(fs, modulePath, template, templateArgs);
            })
          );
        })
        .then(() => {
          // Adds and link the new library
          return new Promise((resolve) => {
            // postinstall workaround script *only* needed in case
            // the DEPRECATED --example-file-linkage option
            // (exampleFileLinkage: true) is used
            // (not needed otherwise):
            if (exampleFileLinkage) {
              info('Adding the cleanup postinstall *workaround* task to the example app');
              npmAddScriptSync(`${pathExampleApp}/package.json`, {
                key: 'postinstall',
                value: `node ../scripts/examples_postinstall.js`
              }, fs);
            }

            // Add and link the new library
            info('Linking the new module library to the example app');
            const addLinkLibraryCommand = exampleFileLinkage
              ? 'yarn add file:../'
              : 'yarn add link:../';
            const addLinkLibraryOptions = { cwd: pathExampleApp, stdio: 'inherit' };
            try {
              commandSync(addLinkLibraryCommand, addLinkLibraryOptions);
            } catch (e) {
              error('Yarn failure for example, aborting');
              throw (e);
            }

            // Since React Native 0.60, pod install must be done (again)
            // after adding the native library to the generated example.
            if (platforms.indexOf('ios') !== -1) {
              const iosExampleAppProjectPath =
                `${pathExampleApp}/ios`;

              const podCommandOptions = {
                cwd: iosExampleAppProjectPath,
                stdio: 'inherit'
              };

              // pod tool is needed at this point for iOS
              try {
                info(
                  `check for valid pod version in ${iosExampleAppProjectPath}`);

                commandSync('pod --version', podCommandOptions);
              } catch (e) {
                error('pod --version failure, aborting with broken example app');
                throw (e);
              }

              info(`running pod install in ${iosExampleAppProjectPath}`);

              try {
                commandSync('pod install', podCommandOptions);
              } catch (e) {
                error('pod install failure, aborting with broken example app');
                throw (e);
              }
            }
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
