const path = require('path')

// default fs object
const fsExtra = require('fs-extra')

const jsonfileDefault = require('jsonfile')

const pipe = require('promise.pipe')

const normalizedOptions = require('./normalized-options')

// (...) import from templates (...)
const templates = require('../templates')
const exampleTemplates = require('../templates/example')
// (...)

const { npmAddScriptSync } = require('./utils')
const { execSync } = require('child_process')

// TBD FAKE execa object for now:
const execaDefault = { commandSync: execSync }
// ALSO TESTED with the REAL execa - imported as follows:
// const execaDefault = require('execa');
// (with execa package added to package.json, of course)

const DEFAULT_PREFIX = ''
const DEFAULT_PACKAGE_IDENTIFIER = 'com.reactlibrary'
const DEFAULT_PLATFORMS = ['android', 'ios']
const DEFAULT_GITHUB_ACCOUNT = 'github_account'
const DEFAULT_AUTHOR_NAME = 'Your Name'
const DEFAULT_AUTHOR_EMAIL = 'yourname@email.com'
const DEFAULT_LICENSE = 'MIT'
const DEFAULT_USE_COCOAPODS = false
const DEFAULT_GENERATE_EXAMPLE = false
const DEFAULT_EXAMPLE_NAME = 'example'
const DEFAULT_EXAMPLE_REACT_NATIVE_VERSION = 'react-native@0.59'

// FUTURE TODO replace this with a nice external library function
// (this *should* work with either an array or multiple args,
//  ... just like promise.pipe):
const pipe2 = (first, ...rest) => (
  pipe([].concat(first, rest).map(f =>
    (...args) => Promise.resolve(f(...args))
  ))()
)

// TBD more utility functions to be moved out or replaced:
const thenResolve = o => () => Promise.resolve(o)
const thenCall = f => o => () => f(o)
const pipeWithArgs = (args, first, ...rest) => (
  pipe([() => Promise.resolve(args)].concat(first, rest).map(f =>
    (...a) => Promise.resolve(f(...a))
  ))()
)

const renderTemplateIfValid = (fs, root, template, templateArgs) => {
  // avoid throwing an exception in case there is no valid template.name member
  const name = !!template.name && template.name(templateArgs)
  if (!name) return Promise.resolve()

  const filename = path.join(root, name)
  const [baseDir] = filename.split(path.basename(filename))

  return fs.ensureDir(baseDir).then(() =>
    fs.outputFile(filename, template.content(templateArgs))
  )
}

const generateWithOptions = ({
  name = 'unknown', // (should be normalized)
  prefix = DEFAULT_PREFIX,
  moduleName = 'unknown', // (should be normalized)
  className = 'unknown', // (should be normalized)
  modulePrefix = '', // (should be normalized)
  packageIdentifier = DEFAULT_PACKAGE_IDENTIFIER,
  namespace = 'unknown', // (should be normalized)
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
  fs = fsExtra, // (this can be mocked out for testing purposes)
  execa = execaDefault, // (this can be mocked out for testing purposes)
  jsonfile = jsonfileDefault, // (this can be mocked out for testing purposes)
}) => {
  if (packageIdentifier === DEFAULT_PACKAGE_IDENTIFIER) {
    console.warn(`While \`{DEFAULT_PACKAGE_IDENTIFIER}\` is the default package
      identifier, it is recommended to customize the package identifier.`)
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
  authorEmail: ${authorEmail}
  license: ${license}
  view: ${view}
  useCocoapods: ${useCocoapods}
  generateExample: ${generateExample}
  exampleName: ${exampleName}
  `)

  // QUICK LOCAL INJECTION overwite of existing execSync / commandSync call from
  // mockable execa object for now (at least):
  const commandSync = execa.commandSync

  if (generateExample) {
    const reactNativeVersionCommand = 'react-native --version'
    const yarnVersionCommand = 'yarn --version'

    const checkCliOptions = { stdio: 'inherit' }
    const errorRemedyMessage = 'both react-native-cli and yarn CLI tools are needed to generate example project'

    try {
      console.info('CREATE: Check for valid react-native-cli tool version, as needed to generate the example project')
      commandSync(reactNativeVersionCommand, checkCliOptions)
      console.info(`${reactNativeVersionCommand} ok`)
    } catch (e) {
      throw new Error(
        `${reactNativeVersionCommand} failed; ${errorRemedyMessage}`)
    }

    try {
      console.info('CREATE: Check for valid Yarn CLI tool version, as needed to generate the example project')
      commandSync(yarnVersionCommand, checkCliOptions)
      console.info(`${yarnVersionCommand} ok`)
    } catch (e) {
      throw new Error(
        `${yarnVersionCommand} failed; ${errorRemedyMessage}`)
    }
  }

  console.info('CREATE: Generating the React Native library module')

  const generateWithoutExample = () => (
    pipe2(
      thenCall(fs.ensureDir)(moduleName), // (create the directory if needed)
      () => Promise.all(templates.filter((template) => (
        (template.platform)
          ? platforms.includes(template.platform)
          : true
      )).filter((template) => (
        !!template.name
      )).map((template) => (
        pipeWithArgs({
          // template arguments:
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
        )
      )))
    )
  )

  // The separate promise makes it easier to generate
  // multiple test/sample projects, if needed.
  const generateExampleWithName = () => (
    // FUTURE TODO reformat this pipe2 call:
    pipeWithArgs({
      // exec command args:
      exampleReactNativeInitCommand:
        `react-native init ${exampleName} --version ${exampleReactNativeVersion}`,

      execOptions: { cwd: `./${moduleName}`, stdio: 'inherit' }
    }, ({ exampleReactNativeInitCommand, execOptions }) => (
      // (with the work done in a promise pipe chain)
      pipe2([
        () => (
          console.info(
            `CREATE example app with the following command: ${exampleReactNativeInitCommand}`)
        ),
        () => Promise.resolve().then(() =>
          // We use synchronous execSync / commandSync call here
          // which is able to output its stdout to stdout in this process.
          // Note that any exception would be properly handled since this
          // call is executed within a Promise.resolve().then() callback.
          // FUTURE TODO asynchronous exec command call so that no
          // Promise.resolve().then() callback wrapper is needed here.
          commandSync(exampleReactNativeInitCommand, execOptions)
        ),
        // next step with the following template arguments:
        () => (
          {
            name: className,
            moduleName,
            view,
            useCocoapods,
            exampleName,
          }
        ),
        (templateArgs) =>
          (
            // Execute the example template
            Promise.all(
              exampleTemplates.map((template) => (
                renderTemplateIfValid(fs, moduleName, template, templateArgs)
              ))
            )
          ),
        () => (
          // Adds and link the new library
          new Promise((resolve, reject) => {
            // Add postinstall script to the example package.json
            console.info('Adding cleanup postinstall task to the example app')
            const pathExampleApp = `./${moduleName}/${exampleName}`
            npmAddScriptSync(`${pathExampleApp}/package.json`, {
              key: 'postinstall',
              value: `node ../scripts/examples_postinstall.js`
            }, jsonfile)

            // Add and link the new library
            console.info('Linking the new module library to the example app')
            const addLinkLibraryOptions = { cwd: pathExampleApp, stdio: 'inherit' }
            try {
              commandSync('yarn add file:../', addLinkLibraryOptions)
            } catch (e) {
              console.error('Yarn failure for example, aborting')
              throw (e)
            }
            commandSync('react-native link', addLinkLibraryOptions)

            return resolve()
          })
        )
      ])
    ))
  )

  return pipe2(
    generateWithoutExample,
    generateExample ? generateExampleWithName : thenResolve(null),
  )
}

module.exports = (options) => (
  generateWithOptions(normalizedOptions(options))
)
