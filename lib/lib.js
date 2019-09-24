// Node.js built-in:

const path = require('path');

// External imports:

// default execa object
const execaDefault = require('execa');

// default fs object
const fsExtra = require('fs-extra');

const jsonfile = require('jsonfile');

// starting point for promise pipelines:
const ppipe = require('promise.pipe');

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

// FUTURE TODO replace this with a nice external library function
// (this *should* work with either an array or multiple args, ...
//  ... just like promise.pipe):
const startPromisePipeline = (first, ...rest) => (
  ppipe([].concat(first, rest).map(f =>
    (...args) => Promise.resolve(f(...args))
  ))()
);

// FUTURE TBD some more utility functions to be cleaned up
// and hopefully replaced by external utility library functions:
const newPromisePipeline = (...args) => () => startPromisePipeline(...args);
const startPipelineStageWithProperties = (args, ...rest) => (
  startPromisePipeline([() => Promise.resolve(args)].concat(rest))
);
const thenCallWithArguments = f => (...a) => () => f(...a);
const thenResolveWithValue = o => () => Promise.resolve(o);
const thenStartPipelineStageWithProperties = (...a) =>
  thenCallWithArguments(startPipelineStageWithProperties)(...a);

const renderTemplateIfValid = (fs, root, template, templateArgs) => {
  // avoid throwing an exception in case there is no valid template.name member
  const name = !!template.name && template.name(templateArgs);
  if (!name) return Promise.resolve();

  const filename = path.join(root, name);
  const [baseDir] = filename.split(path.basename(filename));

  return startPromisePipeline(
    thenCallWithArguments(fs.ensureDir)(baseDir),
    thenCallWithArguments(fs.outputFile)(filename, template.content(templateArgs))
  );
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

  // [...]
  const checkToolsForExampleApp = newPromisePipeline(
    thenStartPipelineStageWithProperties({
      reactNativeVersionCommand: 'react-native --version',
      yarnVersionCommand: 'yarn --version',
      checkCliOptions: { stdio: 'inherit' },
      errorRemedyMessage: 'both react-native-cli and yarn CLI tools are needed to generate example project'
    },
    ({ reactNativeVersionCommand, yarnVersionCommand, checkCliOptions, errorRemedyMessage }) => (
      startPromisePipeline(
        thenCallWithArguments(console.info)(
          'CREATE: Check for valid react-native-cli tool version, as needed to generate the example project'),
        () => (
          // synchronous system command call with very simple error handling
          Promise.resolve().then(
            thenCallWithArguments(commandSync)(reactNativeVersionCommand, checkCliOptions)
          ).catch((e) => {
            throw new Error(`${reactNativeVersionCommand} failed; ${errorRemedyMessage}`);
          })
        ),
        thenCallWithArguments(console.info)(`${reactNativeVersionCommand} ok`),
        thenCallWithArguments(console.info)(
          'CREATE: Check for valid Yarn CLI tool version, as needed to generate the example project'),
        () => (
          // synchronous system command call with very simple error handling
          Promise.resolve().then(
            thenCallWithArguments(commandSync)(yarnVersionCommand, checkCliOptions)
          ).catch((e) => {
            throw new Error(`${yarnVersionCommand} failed; ${errorRemedyMessage}`);
          })
        ),
        thenCallWithArguments(console.info)(`${yarnVersionCommand} ok`),
      )
    ))
  );

  // [...]
  const generateLibraryModule = newPromisePipeline(
    thenCallWithArguments(console.info)(
      'CREATE: Generating the React Native library module'),
    thenCallWithArguments(fs.ensureDir)(moduleName),
    () => (
      Promise.all(
        templates.filter(
          (template) => (
            (template.platform)
              ? platforms.includes(template.platform)
              : true
          )
        ).filter((template) => (
          !!template.name
        )).map((template) => startPipelineStageWithProperties({
          // template properties:
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
        }, (templateArgs) =>
          // render the template here
          // (with no example included):
          renderTemplateIfValid(fs, moduleName, template, templateArgs)
        ))
      )
    )
  );

  // This separate promise makes it easier to generate
  // multiple test or sample apps in the future.
  const generateExampleApp = newPromisePipeline(
    thenStartPipelineStageWithProperties({
      // exec command args:
      exampleReactNativeInitCommand:
        `react-native init ${exampleName} --version ${exampleReactNativeVersion}`,
      execOptions: { cwd: `./${moduleName}`, stdio: 'inherit' }
    }, ({ exampleReactNativeInitCommand, execOptions }) => (
      // (with the work done in a promise pipe chain)
      startPromisePipeline([
        thenCallWithArguments(console.info)(
          `CREATE example app with the following command: ${exampleReactNativeInitCommand}`),
        () => (
          // We use synchronous execSync / commandSync call here
          // which is able to output its stdout to stdout in this process.
          // Note that any exception would be properly handled since this
          // call is executed within a Promise.resolve().then() callback.
          // FUTURE TODO asynchronous exec command call so that
          // Promise.resolve().then() callback wrapper can be
          // completely removed.
          Promise.resolve().then(
            thenCallWithArguments(commandSync)(exampleReactNativeInitCommand, execOptions)
          )
        ),
        thenStartPipelineStageWithProperties(
          {
            name: className,
            moduleName,
            view,
            useCocoapods,
            exampleName,
          },
          (templateArgs) => (
            // Execute the example template
            Promise.all(
              exampleTemplates.map((template) => (
                renderTemplateIfValid(fs, moduleName, template, templateArgs)
              ))
            )
          )
        ),
        thenStartPipelineStageWithProperties(
          { pathExampleApp: `./${moduleName}/${exampleName}` },
          ({ pathExampleApp }) => startPipelineStageWithProperties(
            { jsonPath: `${pathExampleApp}/package.json` },
            ({ jsonPath }) => startPromisePipeline(
              thenCallWithArguments(console.info)(
                'Adding cleanup postinstall task to the example app'),
              () =>
                Promise.resolve().then(
                  // resolves with the example package JSON data:
                  thenCallWithArguments(jsonfile.readFileSync)(jsonPath, { fs })
                ).catch(e => {
                  if (/ENOENT.*package.json/.test(e.message)) {
                    throw new Error(`The package.json at path: ${jsonPath} does not exist.`);
                  } else {
                    throw e;
                  }
                }),
              (json) => Promise.resolve(
                // resolves with the updated example JSON data
                // onto the promise pipeline:
                {
                  ...json,
                  scripts: {
                    postinstall: 'node ../scripts/examples_postinstall.js',
                    ...json.scripts
                  }
                }
              ),
              (jsonOutput) =>
                Promise.resolve().then(
                  thenCallWithArguments(jsonfile.writeFileSync)(jsonPath, jsonOutput, { fs, spaces: 2 })
                )
            ),
            thenStartPipelineStageWithProperties(
              { addLinkLibraryOptions: { cwd: pathExampleApp, stdio: 'inherit' } },
              ({ addLinkLibraryOptions }) => startPromisePipeline(
                thenCallWithArguments(console.info)(
                  'Linking the new module library to the example app'),
                () => (
                  Promise.resolve().then(
                    thenCallWithArguments(commandSync)('yarn add file:../', addLinkLibraryOptions)
                  ).catch((e) => {
                    console.error('Yarn failure for example, aborting');
                    throw (e);
                  })
                ),
                () => (
                  Promise.resolve().then(
                    thenCallWithArguments(commandSync)('react-native link', addLinkLibraryOptions)
                  )
                )
              )
            ),
          )
        )
      ])
    ))
  );

  // [...]
  return startPromisePipeline(
    generateExample ? checkToolsForExampleApp : thenResolveWithValue(null),
    generateLibraryModule,
    generateExample ? generateExampleApp : thenResolveWithValue(null),
  );
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
