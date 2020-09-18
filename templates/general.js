module.exports = [{
  name: () => 'README.md',
  content: ({ moduleName, objectClassName }) =>
    `# ${moduleName}

## Getting started

\`$ npm install ${moduleName} --save\`

### Mostly automatic installation

\`$ react-native link ${moduleName}\`

## Usage
\`\`\`javascript
import ${objectClassName} from '${moduleName}';

// TODO: What to do with the module?
${objectClassName};
\`\`\`
`,
}, {
  name: () => 'package.json',
  content: ({ moduleName, platforms, githubAccount, authorName, authorEmail, license, useTypescript }) => {
    const files =
      `[
    "README.md",` +
    (platforms.indexOf('android') >= 0 ? `
    "android",` : ``) + `
    "src"` +
    (useTypescript ? `
    "lib"` : ``) +
    (platforms.indexOf('ios') >= 0 ? `,
    "ios",
    "${moduleName}.podspec"` : ``) + `
  ]`;

    const peerDependencies =
      `{
    "react": "^16.8.1",
    "react-native": ">=0.60.0-rc.0 <1.0.x"
  }`;

    const devDependencies =
      `{
    "react": "^16.9.0",
    "react-native": "^0.61.5"` +
    (useTypescript ? `,
    "typescript": "^4.0.0",
    "@types/react": "^16.9.49",
    "@types/react-native": "^0.61.23"` : ``) + `
  }`;

    const scripts = `{` + (useTypescript ? `
    "build": "tsc",` : ``) + `
    "test": "echo \\"Error: no test specified\\" && exit 1"
  }`;

    const artifacts =
      `"main": ${useTypescript ? `"lib/index.js"` : `"src/index.js"`}` + (useTypescript ? `
  "types": "lib/index.d.ts"` : ``);

    return `{
  "name": "${moduleName}",
  "title": "${moduleName.split('-').map(word => word[0].toUpperCase() + word.substr(1)).join(' ')}",
  "version": "1.0.0",
  "description": "TODO",
  ${artifacts},
  "files": ${files},
  "scripts": ${scripts},
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
  }
}, {
  // for module without view, use js:
  name: ({ view, useTypescript }) => (!view && !useTypescript) && 'src/index.js',
  content: ({ objectClassName }) =>
    `import { NativeModules } from 'react-native';

const { ${objectClassName} } = NativeModules;

export default ${objectClassName};
`,
}, {
  // for module without view, use ts:
  name: ({ view, useTypescript }) => (!view && useTypescript) && 'src/index.ts',
  content: ({ objectClassName }) =>
    `import { NativeModules } from 'react-native';

type ${objectClassName}Types = {
  sampleMethod: (stringArgument: string, numberArgument: number, (message: string) => void)
};

const { ${objectClassName} } = NativeModules;

export default ${objectClassName} as ${objectClassName}Types;
`,
}, {
  // for module with view, use js:
  name: ({ view, useTypescript }) => (view && !useTypescript) && 'src/index.js',
  content: ({ objectClassName }) =>
    `import { requireNativeComponent } from 'react-native';

const ${objectClassName} = requireNativeComponent('${objectClassName}', null);

export default ${objectClassName};
`,
}, {
  // for module with view, use ts:
  name: ({ view, useTypescript }) => (view && useTypescript) && 'src/index.ts',
  content: ({ objectClassName }) =>
    `import React from 'react'
import { requireNativeComponent } from 'react-native';

type ${objectClassName}Props = {
  // something
  // if you want to inherit react-native's ViewProps, import it from 'react-native' manually.
}

const ${objectClassName}:  = requireNativeComponent('${objectClassName}', null);

export default ${objectClassName} as React.ComponentClass<${objectClassName}Props>;
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
lib/
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
}, {
  name: ({ useTypescript }) => useTypescript ? 'tsconfig.json' : undefined,
  content: () =>
  `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["ES2020"],
    "module": "ES2015",
    "jsx": "react-native",

    "baseUrl": ".",
    "rootDir": "./src",
    "outDir": "./lib",
    
    "strict": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
`
}, {
  // github actions deploy to github packages
  name: () => '.github/workflows/publish.yml',
  content: () =>
    `
name: publish

on:
  push:
    branches:
      - '**'
    tags:
      - 'v*'

jobs:
  build:
    name: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 1

      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          node-version: "10"
          registry-url: https://npm.pkg.github.com

      - name: Setup yarn
        run: npm install -g yarn

      - name: install
        run: yarn install --frozen-lockfile

      - name: build
        run: yarn build

      - name: publish
        if: startsWith(github.ref, 'refs/tags/')
        run: yarn publish
        env:
          NODE_AUTH_TOKEN: \\$\\{\\{ secrets.GITHUB_TOKEN \\}\\}
`,
}];
