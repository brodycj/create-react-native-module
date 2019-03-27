# create-react-native-module

Tool to create a React Native library module or native view component, with a single command.

See below for command-line usage, example with no view, and example with an extremely simple native view.

This tool based on [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library), with working example callbacks, optional native view, and some other updates added by [@brodybits (Christoper J. Brody aka Chris Brody)](https://github.com/brodybits).

<!-- FUTURE TODO: QUICK USAGE SECTION HERE -->

**LICENSE:** MIT

### Why might you need this?

If you are looking to create a native module for React Native, you need some native code for each platform you want to support and then some JavaScript code to bind it all together. Setting this up by yourself can be time-consuming.

This is where this tool comes in. It creates a boilerplate with all current best practices in mind.
Why not use `react-native new-library`? Unfortunately that command doesn't create an up-to-date library, requires an already initialized React Native project and only sets up the iOS side of things.

### Alternatives

- [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library)
- [`react-native-create-bridge`](https://github.com/peggyrayzis/react-native-create-bridge)

## Installation

Requirements: Node 6.0+

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

  --help                                    output usage information
  --prefix <prefix>                         The prefix for the library (Default: ``)
  --module-name <moduleName>                The module library package name to be used in package.json. Default: react-native-(name in param-case)
  --module-prefix <modulePrefix>            The module prefix for the library, ignored if --module-name is specified (Default: `react-native`)
  --package-identifier <packageIdentifier>  (Android only!) The package name for the Android module (Default: `com.reactlibrary`)
  --platforms <platforms>                   Platforms the library will be created for. (comma separated; default: `ios,android`)
  --github-account <github_account>         The github account where the library is hosted (Default: `github_account`)
  --author-name <name>                      The author's name (Default: `Your Name`)
  --author-email <email>                    The author's email (Default: `yourname@email.com`)
  --license <license>                       The license type of this library (Default: `Apache-2.0`)
  --view                                    Generate the module as a very simple native view component (Default: `false`)
  --generate-example <shouldGenerate>       Generate an example project and links the library module to it, requires both react-native-cli and yarn to be installed globally (Default: `false`)
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
  prefix: String, /* The prefix for the library (Default: RN) */
  moduleName: String, /* The module library package name to be used in package.json. Default: react-native-(name in param-case) */
  modulePrefix: String, /* The module prefix for the library, ignored if moduleName is specified (Default: react-native) */
  platforms: Array, /* Platforms the library will be created for. (Default: ['ios', 'android']) */
  packageIdentifier: String, /* (Android only!) The package name for the Android module (Default: com.reactlibrary) */
  githubAccount: String, /* The github account where the library is hosted (Default: `github_account`) */
  authorName: String, /* The author's name (Default: `Your Name`) */
  authorEmail: String, /* The author's email (Default: `yourname@email.com`) */
  license: String, /* The license type of this library (Default: `Apache-2.0`) */
  view: Boolean, /* Generate the module as a very simple native view component (Default: `false`) */
  generateExample: Boolean, /* Generate an example project and links the library module to it, requires both react-native-cli and yarn to be installed globally (Default: `false`) */
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

To run on iOS:

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

Then go into the example app subdirectory:

```
cd react-native-carol-widget/example
```

__Within the example test app subdirectory:__

It is *recommended* to start the Metro Bundler manually as described above (within `react-native-carol-widget/example`):

```
npm start
```

To run on Android, do `react-native run-android` as described for the other example above.

To run on iOS, do `react-native run-ios` or `open ios/example.xcodeproj` as described for the other example above.

__Expected result:__

- on Android: a check box that is checked (and cannot be changed)
- on iOS: a label with 5 red asterisks

## Acknowledgements

- [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library) - original basis of this project
- [`react-native-share`](https://www.npmjs.com/package/react-native-share) - was acknowledged as "a great source of inspiration" for [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library)
