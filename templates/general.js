module.exports = [{
  name: () => 'README.md',
  content: ({ packageName, objectClassName }) =>
    `# ${packageName}

## Getting started

\`$ npm install ${packageName} --save\`

### Mostly automatic installation

\`$ react-native link ${packageName}\`

## Usage
\`\`\`javascript
import ${objectClassName} from '${packageName}';

// TODO: What to do with the module?
${objectClassName};
\`\`\`
`,
}, {
  name: () => 'package.json',
  content: ({ packageName, platforms, githubAccount, authorName, authorEmail, license }) => {
    const files =
      `[
    "README.md",` +
    (platforms.indexOf('android') >= 0 ? `
    "android",` : ``) + `
    "index.js"` +
    (platforms.indexOf('ios') >= 0 ? `,
    "ios",
    "${packageName}.podspec"` : ``) + `
  ]`;

    const peerDependencies =
      `{
    "react": ">=16.8.1",
    "react-native": ">=0.60.0-rc.0 <1.0.x"
  }`;

    const devDependencies =
      `{
    "react": "^16.9.0",
    "react-native": "^0.61.5"
  }`;

    return `{
  "name": "${packageName}",
  "title": "${packageName.split('-').map(word => word[0].toUpperCase() + word.substr(1)).join(' ')}",
  "version": "1.0.0",
  "description": "TODO",
  "main": "index.js",
  "files": ${files},
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/${githubAccount}/${packageName}.git",
    "baseUrl": "https://github.com/${githubAccount}/${packageName}"
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
  }
}, {
  // for module without view:
  name: ({ isView }) => !isView && 'index.js',
  content: ({ objectClassName }) =>
    `// main index.js

import { NativeModules } from 'react-native';

const { ${objectClassName} } = NativeModules;

export default ${objectClassName};
`,
}, {
  // for module with view:
  name: ({ isView }) => isView && 'index.js',
  content: ({ objectClassName }) =>
    `// main index.js

import { requireNativeComponent } from 'react-native';

const ${objectClassName} = requireNativeComponent('${objectClassName}', null);

export default ${objectClassName};
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
  }
}];
