const fs = require('fs');

const path = require('path');

// FUTURE TBD consider making more reusable utility function or package

// THANKS for *partial* guidance:
// https://stackoverflow.com/questions/12752622/require-file-as-string/12753026#12753026
const packageJsonPath = require.resolve('../package.json');

// THANKS for guidance:
// https://stackoverflow.com/questions/42956127/get-parent-directory-name-in-node-js/43779639#43779639
const rootPath = path.dirname(packageJsonPath);

module.exports = [{
  name: () => 'README.md',
  content: ({ moduleName, name }) => {
    // FUTURE TBD async:
    const content = fs.readFileSync(`${rootPath}/templates/common/README.md`);

    return (`${content}`
      .replace(/react-native-output-module-name/g, moduleName)
      .replace(/MyNativeModuleName/g, name));
  }
}, {
  name: () => 'package.json',
  content: ({ moduleName, platforms, githubAccount, authorName, authorEmail, license }) => {
    // NOTE: placeholder template in templates/common/package.json
    // is ignored and completely overwritten for now.
    const withWindows = platforms.indexOf('windows') >= 0;

    const peerDependencies =
      `{
    "react": "^16.8.1",
    "react-native": ">=0.59.0-rc.0 <1.0.x"` +
      (withWindows
        ? `,
    "react-native-windows": ">=0.59.0-rc.0 <1.0.x"`
        : ``) + `
  }`;

    const devDependencies =
      `{
    "react": "^16.8.3",
    "react-native": "^0.59.10"` +
        (withWindows
          ? `,
    "react-native-windows": "^0.59.0-rc.1"`
          : ``) + `
  }`;

    return `{
  "name": "${moduleName}",
  "title": "${moduleName.split('-').map(word => word[0].toUpperCase() + word.substr(1)).join(' ')}",
  "version": "1.0.0",
  "description": "TODO",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/${githubAccount}/${moduleName}.git",
    "baseUrl": "https://github.com/${githubAccount}/${moduleName}"
  },
  "keywords": [
    "react-native"
  ],
  "author": {
    "name": "${authorName}",
    "email": "${authorEmail}"
  },
  "license": "${license}",
  "licenseFilename": "LICENSE",
  "readmeFilename": "README.md",
  "peerDependencies": ${peerDependencies},
  "devDependencies": ${devDependencies}
}
`;
  },
}, {
  // for module without view:
  name: ({ view }) => !view && 'index.js',
  content: ({ name }) => {
    // FUTURE TBD async:
    const content = fs.readFileSync(`${rootPath}/templates/library/index.js`);

    return (`${content}`
      .replace(/MyNativeModuleName/g, name));
  }
}, {
  // for module with view:
  name: ({ view }) => view && 'index.js',
  content: ({ name }) => {
    // FUTURE TBD async:
    const content = fs.readFileSync(`${rootPath}/templates/view/index.js`);

    return (`${content}`
      .replace(/MyNativeModuleName/g, name));
  }
}, {
  name: () => '.gitignore',
  content: ({ platforms }) => {
    // FUTURE TBD async:
    const content = fs.readFileSync(`${rootPath}/templates/common/.gitignore`);
    return `${content}`;
  },
}, {
  name: () => '.gitattributes',
  content: () => {
    // FUTURE TBD async:
    const content = fs.readFileSync(`${rootPath}/templates/common/.gitattributes`);
    return `${content}`;
  }
}, {
  name: () => '.npmignore',
  content: ({ generateExample, exampleName }) => {
    if (generateExample) {
      return `${exampleName}\n`;
    }

    return '';
  }
}];
