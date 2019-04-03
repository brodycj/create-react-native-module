const path = require('path');

const normalizedOptions = require('./normalized-options');

const templates = require('./templates');
const { createFile, createFolder, npmAddScriptSync, exec } = require('./utils');
const { execSync } = require('child_process');

const DEFAULT_PREFIX = '';
const DEFAULT_PACKAGE_IDENTIFIER = 'com.reactlibrary';
const DEFAULT_PLATFORMS = ['android', 'ios'];
const DEFAULT_GITHUB_ACCOUNT = 'github_account';
const DEFAULT_AUTHOR_NAME = 'Your Name';
const DEFAULT_AUTHOR_EMAIL = 'yourname@email.com';
const DEFAULT_LICENSE = 'Apache-2.0';
const DEFAULT_GENERATE_EXAMPLE = false;

const renderTemplateIfValid = (root, template, templateArgs) => {
  const name = template.name(templateArgs);
  if (!name) return Promise.resolve();

  const filename = path.join(root, name);
  const baseDir = filename.split(path.basename(filename))[0];

  return createFolder(baseDir).then(() =>
    createFile(filename, template.content(templateArgs))
  );
};

// alias, at least for now:
const renderTemplate = renderTemplateIfValid;

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
  generateExample = DEFAULT_GENERATE_EXAMPLE,
}) => {
  if (packageIdentifier === DEFAULT_PACKAGE_IDENTIFIER) {
    console.warn(`While \`{DEFAULT_PACKAGE_IDENTIFIER}\` is the default package
      identifier, it is recommended to customize the package identifier.`);
  }

  if (generateExample) {
    console.info('Check for react-native-cli and yarn CLI tools that are needed to generate example project');

    const checkCliOptions = { stdio: 'inherit' };

    try {
      execSync('react-native --version', checkCliOptions);
    } catch (e) {
      throw new Error(
        'react-native --version failed; both react-native-cli and yarn are needed to generate example project');
    }

    try {
      execSync('yarn --version', checkCliOptions);
    } catch (e) {
      throw new Error(
        'yarn --version failed; both react-native-cli and yarn are needed to generate example project');
    }
  }

  const generateWithoutExample = () => {
    return createFolder(moduleName).then(() => {
      return Promise.all(templates.filter((template) => {
        if (template.platform) {
          return (platforms.indexOf(template.platform) >= 0);
        }

        return true;
      }).map((template) => {
        if (!template.name) {
          return Promise.resolve();
        }
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
          generateExample,
        };

        return renderTemplateIfValid(moduleName, template, templateArgs);
      }));
    });
  };

  // The separate promise makes it easier to generate
  // multiple test/sample projects, if needed.
  const generateExampleWithName =
    (exampleName, commandOptions) => {
      const addOptions = commandOptions
        ? ` ${commandOptions}`
        : '';
      const execOptions = { cwd: `./${moduleName}`, stdio: 'inherit' };
      return exec(`react-native init ${exampleName}${addOptions}`, execOptions)
        .then(() => {
          // Execute the example template
          const exampleTemplates = require('./templates/example');

          const templateArgs = {
            name: className,
            moduleName,
            view,
          };

          return Promise.all(
            exampleTemplates.map((template) => {
              return renderTemplate(moduleName, template, templateArgs);
            })
          );
        })
        .then(() => {
          // Adds and link the new library
          return new Promise((resolve, reject) => {
            // Add postinstall script to the example package.json
            const pathExampleApp = `./${moduleName}/${exampleName}`;
            npmAddScriptSync(`${pathExampleApp}/package.json`, {
              key: 'postinstall',
              value: `node ../scripts/examples_postinstall.js`
            });

            // Add and link the new library
            const addLinkLibraryOptions = { cwd: pathExampleApp, stdio: 'inherit' };
            try {
              execSync('yarn add file:../', addLinkLibraryOptions);
            } catch (e) {
              execSync('npm install ../', addLinkLibraryOptions);
              execSync('npm install', addLinkLibraryOptions);
            }
            execSync('react-native link', addLinkLibraryOptions);

            return resolve();
          });
        });
    };

  return generateWithoutExample().then(() => {
    return (generateExample
      ? generateExampleWithName('example')
      : Promise.resolve()
    );
  });
};

module.exports = (options) => {
  return generateWithOptions(normalizedOptions(options));
};
