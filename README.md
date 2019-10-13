# create-react-native-module

Tool to create a React Native library module or native view component, with a single command.

[![GitHub license](https://img.shields.io/github/license/brodybits/create-react-native-module.svg?color=blue&style=for-the-badge)](./LICENSE)
[![npm](https://img.shields.io/npm/v/create-react-native-module.svg?color=green&style=for-the-badge)](https://www.npmjs.com/package/create-react-native-module)
[![npm downloads](https://img.shields.io/npm/dw/create-react-native-module.svg?label=npm%20downloads&style=for-the-badge)](https://npmcharts.com/compare/create-react-native-module?minimal=true)
[![total npm downloads](https://img.shields.io/npm/dt/create-react-native-module.svg?label=total%20npm%20downloads&style=for-the-badge)](https://npmcharts.com/compare/create-react-native-module?minimal=true)
[![GitHub watchers](https://img.shields.io/github/watchers/brodybits/create-react-native-module.svg?style=for-the-badge)](https://github.com/brodybits/create-react-native-module/watchers)
[![GitHub stars](https://img.shields.io/github/stars/brodybits/create-react-native-module.svg?label=GitHub%20stars&style=for-the-badge)](https://github.com/brodybits/create-react-native-module/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/brodybits/create-react-native-module.svg?style=for-the-badge)](https://github.com/brodybits/create-react-native-module/network/members)
[![open bugs](https://img.shields.io/github/issues-raw/brodybits/create-react-native-module/bug.svg?color=d73a4a&label=open%20bugs&style=for-the-badge)](https://github.com/brodybits/create-react-native-module/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug)
[![total open issues](https://img.shields.io/github/issues-raw/brodybits/create-react-native-module.svg?label=total%20open%20issues&style=for-the-badge)](https://github.com/brodybits/create-react-native-module/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/brodybits/create-react-native-module.svg?style=for-the-badge)](https://github.com/brodybits/create-react-native-module/pulls)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/brodybits/create-react-native-module/pulls)

See below for command-line usage, example with no view, and example with an extremely simple native view.

This tool based on [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library), with working example callbacks, optional native view, and more updates added by [@brodybits (Christoper J. Brody aka Chris Brody)](https://github.com/brodybits) and other [contributors](https://github.com/brodybits/create-react-native-module/graphs/contributors).

### Support options

- community support via [issues](https://github.com/brodybits/create-react-native-module/issues)
- commercial support is available, see <http://xpbrew.consulting>

<!-- FUTURE TODO: QUICK USAGE SECTION HERE -->

### General status

- **React Native versions supported:**
  - recommended: `0.60`, `0.61-rc` (see known quirks and issues below)
  - outdated: `0.59`
- Known quirks & issues on React Native 0.60(+):
  - [issue #99](https://github.com/brodybits/create-react-native-module/issues/99) - additional `pod install` step needed for RN 0.60 on iOS
  - [issue #29](https://github.com/brodybits/create-react-native-module/issues/29) - View does not work with RN 0.60 on Android (quick patch needed)
  - React Native 0.60(+) currently not supported by Expo or react-native-windows
- Out-of-tree platform support
  - tvOS platform support - unstable with very limited testing, minimum react-native-tvos version is 0.60 (see [issue #95](https://github.com/brodybits/create-react-native-module/issues/95))
  - Windows - unstable (not tested, see [issue #23](https://github.com/brodybits/create-react-native-module/issues/23)); now deprecated and may be removed in the near future (see [issue #43](https://github.com/brodybits/create-react-native-module/issues/43))
  - for future consideration: macOS (see [issue #94](https://github.com/brodybits/create-react-native-module/issues/94))
- Node.js pre-10 support is deprecated and will be removed in the near future (see [issue #38](https://github.com/brodybits/create-react-native-module/issues/38))

### Why might you need this?

If you are looking to create a native module for React Native, you need some native code for each platform you want to support and then some JavaScript code to bind it all together. Setting this up by yourself can be time-consuming.

This is where this tool comes in. It creates a boilerplate with all current best practices in mind.
Why not use `react-native new-library`? Unfortunately that command doesn't create an up-to-date library, requires an already initialized React Native project and only sets up the iOS side of things.

### Alternatives

- [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library)
- [`react-native-create-bridge`](https://github.com/peggyrayzis/react-native-create-bridge)

## Installation

Requirements: Node 8.0+

Packages required to be installed globally if the recommended example app is generated:

- [`react-native-cli`](https://www.npmjs.com/package/react-native-cli)
- [`yarn`](https://www.npmjs.com/package/yarn)

```
$ npm install -g react-native-cli yarn
```

To install this package:

```
$ npm install -g create-react-native-module
```

## Command-line usage

Navigate into an empty directory to execute the command.
```
$ create-react-native-module MyFancyLibrary
```

This will create the folder `MyFancyLibrary` in which the library will be created in.

Now install dependencies by running this command in the newly created library.
```
$ npm install
```

```
Usage: create-react-native-module [options] <name>

Options:

  -V, --version                             output the version number
  --prefix <prefix>                         The prefix for the library module (Default: ``)
  --module-name <moduleName>                The module library package name to be used in package.json. Default: react-native-(name in param-case)
  --module-prefix <modulePrefix>            The module prefix for the library module, ignored if --module-name is specified (Default: `react-native`)
  --package-identifier <packageIdentifier>  [Android] The Java package identifier used by the Android module (Default: `com.reactlibrary`)
  --platforms <platforms>                   Platforms the library module will be created for - comma separated (Default: `ios,android`)
  --github-account <githubAccount>          The github account where the library module is hosted (Default: `github_account`)
  --author-name <authorName>                The author's name (Default: `Your Name`)
  --author-email <authorEmail>              The author's email (Default: `yourname@email.com`)
  --license <license>                       The license type (Default: `MIT`)
  --view                                    Generate the module as a very simple native view component
  --use-cocoapods                           [iOS] EXPERIMENTAL FEATURE NOT SUPPORTED: Use `AFNetworking` dependency as a sample in the podspec; use it from the iOS code & add `ios/Podfile` to generated example
  --generate-example                        Generate an example project and links the library module to it, requires both react-native-cli and yarn to be installed globally
  --example-name <exampleName>              Name for the example project (default: `example`)
  --example-react-native-version <version>  React Native version for the generated example project (default: `react-native@0.59`)
  -h, --help                                output usage information
```

## Programmatic usage

```javascript
const createLibraryModule = require('create-react-native-module');

createLibraryModule({
  name: 'MyFancyLibraryModule'
}).then(() => {
  console.log('Oh yay! My library module has been created!');
})
```

#### Options

```javascript
{
  name: String, /* The name of the library (Default: Library) */
  prefix: String, /* The prefix for the library (Default: ``) */
  moduleName: String, /* The module library package name to be used in package.json. Default: react-native-(name in param-case) */
  modulePrefix: String, /* The module prefix for the library, ignored if moduleName is specified (Default: react-native) */
  platforms: Array | String, /* Platforms the library will be created for. (Default: ['android', 'ios']) */
  packageIdentifier: String, /* [Android] The Java package identifier used by the Android module (Default: com.reactlibrary) */
  githubAccount: String, /* The github account where the library is hosted (Default: `github_account`) */
  authorName: String, /* The author's name (Default: `Your Name`) */
  authorEmail: String, /* The author's email (Default: `yourname@email.com`) */
  license: String, /* The license type of this library (Default: `MIT`) */
  useCocoapods: Boolean, /* [iOS] EXPERIMENTAL FEATURE NOT SUPPORTED: Use `AFNetworking` dependency as a sample in the podspec; use it from the iOS code & add `ios/Podfile` to generated example (Default: false) */
  view: Boolean, /* Generate the module as a very simple native view component (Default: false) */
  generateExample: Boolean, /* Generate an example project and links the library module to it, requires both react-native-cli and yarn to be installed globally (Default: false) */
  exampleName: String, /* Name for the example project (Default: `example`) */
  exampleReactNativeVersion: String, /* React Native version for the generated example project (Default: `react-native@0.59`) */
}
```

## Behavior not tested or supported

- Windows platform support

## Examples

### Example module with no view

__Create the module with no view:__

```
create-react-native-module --prefix CB --package-identifier io.mylibrary --generate-example AliceHelper
```

The module would be generated in the `react-native-alice-helper` subdirectory, and the example test app would be in `react-native-alice-helper/example`.

Then go into the example app subdirectory:

```
cd react-native-alice-helper/example
```

#### Running the example app

__Within the example test app subdirectory:__

It is *recommended* to start the Metro Bundler manually (within `react-native-alice-helper/example`), which would run in the foreground:

```
npm start
```

Otherwise, React Native will open its own window to run the Metro Bundler.

To run on Android, do the following command (within `react-native-alice-helper/example`):

```
react-native run-android
```

This assumes that the `ANDROID_HOME` environmental variable is set properly. Here is a sample command that does not make such an assumption on a mac:

```
ANDROID_HOME=~/Library/Android/sdk react-native run-android
```

For iOS:

Extra installation step needed on React Native 0.60(+) (see [issue #28](https://github.com/brodybits/create-react-native-module/issues/28)):

```
cd ios && pod install && cd ..
```

Then to run on iOS:

```
react-native run-ios
```

or do the following command to open the iOS project in Xcode:

```
open ios/example.xcodeproj
```

__Expected result:__

The example app shows the following indications:

- STATUS: native callback received
- NATIVE CALLBACK MESSAGE with the number argument and string argument values that are received by the native module

### Example view module

__Create the module with an extremely simple view:__

```
create-react-native-module --prefix CB --package-identifier io.mylibrary --view --generate-example CarolWidget
```

The module would be generated in the `react-native-carol-widget` subdirectory, and the example test app would be in `react-native-carol-widget/example`.

Note that this needs an adaptation to work on Android on React Native 0.60(+) (see [issue #29](https://github.com/brodybits/create-react-native-module/issues/29)).

Then go into the example app subdirectory:

```
cd react-native-carol-widget/example
```

__Within the example test app subdirectory:__

It is *recommended* to start the Metro Bundler manually as described above (within `react-native-carol-widget/example`):

```
npm start
```

To run on Android: do `react-native run-android` as described for the other example above.

To run on iOS: do `pod install` in `ios` subdirectory for React Native 0.60(+) (see above), then do `react-native run-ios` or `open ios/example.xcodeproj` as described for the other example above.

__Expected result:__

- on Android: a check box that is checked (and cannot be changed)
- on iOS: a label with 5 red asterisks

## Acknowledgements

- [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library) - original basis of this project
- [`react-native-share`](https://www.npmjs.com/package/react-native-share) - was acknowledged as "a great source of inspiration" for [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library)

## License

[MIT](./LICENSE)
