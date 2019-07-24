module.exports = [{
  name: () => 'scripts/examples_postinstall.js',
  content: ({ exampleName }) =>
    `#!/usr/bin/env node

  /*
   * Using libraries within examples and linking them within packages.json like:
   * "react-native-library-name": "file:../"
   * will cause problems with the metro bundler if the example will run via
   * \`react-native run-[ios|android]\`. This will result in an error as the metro
   * bundler will find multiple versions for the same module while resolving it.
   * The reason for that is that if the library is installed it also copies in the
   * example folder itself as well as the node_modules folder of the library
   * although their are defined in .npmignore and should be ignored in theory.
   *
   * This postinstall script removes the node_modules folder as well as all
   * entries from the libraries .npmignore file within the examples node_modules
   * folder after the library was installed. This should resolve the metro
   * bundler issue mentioned above.
   *
   * It is expected this scripts lives in the libraries root folder within a
   * scripts folder. As first parameter the relative path to the libraries
   * folder within the example's node_modules folder may be provided.
   * This script will determine the path from this project's package.json file
   * if no such relative path is provided.
   * An example's package.json entry could look like:
   * "postinstall": "node ../scripts/examples_postinstall.js node_modules/react-native-library-name/"
   */

  'use strict';

  const fs = require('fs');
  const path = require('path');

  /// Delete all files and directories for the given path
  const removeFileDirectoryRecursively = fileDirPath => {
    // Remove file
    if (!fs.lstatSync(fileDirPath).isDirectory()) {
      fs.unlinkSync(fileDirPath);
      return;
    }

    // Go down the directory an remove each file / directory recursively
    fs.readdirSync(fileDirPath).forEach(entry => {
      const entryPath = path.join(fileDirPath, entry);
      removeFileDirectoryRecursively(entryPath);
    });
    fs.rmdirSync(fileDirPath);
  };

  /// Remove ${exampleName}/node_modules/react-native-library-name/node_modules directory
  const removeLibraryNodeModulesPath = (libraryNodeModulesPath) => {
    const nodeModulesPath = path.resolve(libraryNodeModulesPath, 'node_modules')

    if (!fs.existsSync(nodeModulesPath)) {
      console.log(\`No node_modules path found at \${nodeModulesPath}. Skipping delete.\`)
      return;
    }

    console.log(\`Deleting: \${nodeModulesPath}\`)
    try {
      removeFileDirectoryRecursively(nodeModulesPath);
      console.log(\`Successfully deleted: \${nodeModulesPath}\`)
    } catch (err) {
      console.log(\`Error deleting \${nodeModulesPath}: \${err.message}\`);
    }
  };

  /// Remove all entries from the .npmignore within  ${exampleName}/node_modules/react-native-library-name/
  const removeLibraryNpmIgnorePaths = (npmIgnorePath, libraryNodeModulesPath) => {
    if (!fs.existsSync(npmIgnorePath)) {
      console.log(\`No .npmignore path found at \${npmIgnorePath}. Skipping deleting content.\`);
      return;
    }

    fs.readFileSync(npmIgnorePath, 'utf8').split(/\\r?\\n/).forEach(entry => {
      if (entry.length === 0) {
        return
      }

      const npmIgnoreLibraryNodeModulesEntryPath = path.resolve(libraryNodeModulesPath, entry);
      if (!fs.existsSync(npmIgnoreLibraryNodeModulesEntryPath)) {
        return;
      }

      console.log(\`Deleting: \${npmIgnoreLibraryNodeModulesEntryPath}\`)
      try {
        removeFileDirectoryRecursively(npmIgnoreLibraryNodeModulesEntryPath);
        console.log(\`Successfully deleted: \${npmIgnoreLibraryNodeModulesEntryPath}\`)
      } catch (err) {
        console.log(\`Error deleting \${npmIgnoreLibraryNodeModulesEntryPath}: \${err.message}\`);
      }
    });
  };

  // Main start sweeping process
  (() => {
    // Read out dir of example project
    const exampleDir = process.cwd();

    console.log(\`Starting postinstall cleanup for \${exampleDir}\`);

    // Resolve the React Native library's path within the example's node_modules directory
    const libraryNodeModulesPath = process.argv.length > 2
      ? path.resolve(exampleDir, process.argv[2])
      : path.resolve(exampleDir, 'node_modules', require('../package.json').name);

    console.log(\`Removing unwanted artifacts for \${libraryNodeModulesPath}\`);

    removeLibraryNodeModulesPath(libraryNodeModulesPath);

    const npmIgnorePath = path.resolve(__dirname, '../.npmignore');
    removeLibraryNpmIgnorePaths(npmIgnorePath, libraryNodeModulesPath);
  })();
`
}, {
  name: ({ useCocoapods, exampleName }) =>
    useCocoapods ? `${exampleName}/ios/Podfile` : undefined,
  content: ({ moduleName, exampleName }) => `platform :ios, '10.0'

	target '${exampleName}' do
		rn_path = '../node_modules/react-native'
	
		pod 'yoga', path: "#{rn_path}/ReactCommon/yoga/yoga.podspec"
		pod 'DoubleConversion', :podspec => "#{rn_path}/third-party-podspecs/DoubleConversion.podspec"
		pod 'Folly', :podspec => "#{rn_path}/third-party-podspecs/Folly.podspec"
		pod 'glog', :podspec => "#{rn_path}/third-party-podspecs/GLog.podspec"
		pod 'React', path: rn_path, subspecs: [
			'Core',
			'CxxBridge',
			'RCTAnimation',
			'RCTActionSheet',
			'RCTImage',
			'RCTLinkingIOS',
			'RCTNetwork',
			'RCTSettings',
			'RCTText',
			'RCTVibration',
			'RCTWebSocket',
			'RCTPushNotification',
			'RCTCameraRoll',
			'RCTSettings',
			'RCTBlob',
			'RCTGeolocation',
			'DevSupport'
		]
	
		pod '${moduleName}', :path => '../../${moduleName}.podspec'
	end
`,
}, {
  name: ({ exampleName }) => `${exampleName}/App.js`,
  content: ({ moduleName, name, view }) =>
    `/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import ${name} from '${moduleName}';` +
    (!view
      ? `

export default class App extends Component<{}> {
  state = {
    status: 'starting',
    message: '--'
  };
  componentDidMount() {
    ${name}.sampleMethod('Testing', 123, (message) => {
      this.setState({
        status: 'native callback received',
        message
      });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>☆${name} example☆</Text>
        <Text style={styles.instructions}>STATUS: {this.state.status}</Text>
        <Text style={styles.welcome}>☆NATIVE CALLBACK MESSAGE☆</Text>
        <Text style={styles.instructions}>{this.state.message}</Text>
      </View>
    );
  }
}`
      : `

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>☆${name} example☆</Text>
        <Text style={styles.instructions}>STATUS: loaded</Text>
        <Text style={styles.welcome}>☆☆☆</Text>
        <${name} />
      </View>
    );
  }
}`) +
      `

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
`
}];
