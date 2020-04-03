module.exports = [{
  name: () => 'README.md',
  content: ({ moduleName, name }) =>
    `# ${moduleName}

## Getting started

\`$ npm install ${moduleName} --save\`

### Mostly automatic installation

\`$ react-native link ${moduleName}\`

## Usage
\`\`\`javascript
import ${name} from '${moduleName}';

// TODO: What to do with the module?
${name};
\`\`\`
`,
}, {
  name: () => 'package.json',
  content: ({ moduleName, platforms, githubAccount, authorName, authorEmail, license }) => {
    const peerDependencies =
      `{
    "react": "^16.8.1",
    "react-native": ">=0.60.0-rc.0 <1.0.x"
  }`;

    const devDependencies =
      `{
    "react": "^16.9.0",
    "react-native": "^0.61.5"
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
  content: ({ name }) =>
    `import { NativeModules } from 'react-native';

const { ${name} } = NativeModules;

export default ${name};
`,
}, {
  // for module with view:
  name: ({ view }) => view && 'index.js',
  content: ({ name }) =>
    `import { requireNativeComponent } from 'react-native';

const ${name} = requireNativeComponent('${name}', null);

export default ${name};
`,
}, {
  name: () => '.gitignore',
  content: ({ platforms }) => {
    let content = `# OSX
#
.DS_Store

# node.js
#
node_modules/
npm-debug.log
yarn-error.log
`;

    if (platforms.indexOf('ios') >= 0) {
      content +=
        `
# Xcode
#
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
project.xcworkspace
`;
    }

    if (platforms.indexOf('android') >= 0) {
      content +=
        `
# Android/IntelliJ
#
build/
.idea
.gradle
local.properties
*.iml

# BUCK
buck-out/
\\.buckd/
*.keystore
`;
    }

    return content;
  },
}, {
  name: () => '.gitattributes',
  content: ({ platforms }) => {
    if (platforms.indexOf('ios') >= 0) {
      return '*.pbxproj -text\n';
    }

    return '';
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
