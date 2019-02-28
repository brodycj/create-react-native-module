# create-react-native-module

Tool to create a React Native library module, optionally as an extremely simple view component, with a single command (based on [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library))

<!-- GONE:
![](https://github.com/frostney/react-native-create-library/blob/master/docs/usage.gif)
-->

TODO: QUICK USAGE SECTION HERE

### Why might you need this?

If you are looking to create a native module for React Native, you need some native code for each platform you want to support and then some JavaScript code to bind it all together. Setting this up by yourself can be time-consuming.

This is where this tool comes in. It creates a boilerplate with all current best practices in mind.
Why not use `react-native new-library`? Unfortunately that command doesn't create an up-to-date library, requires an already initialized React Native project and only sets up the iOS side of things.

### Alternatives

- [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library)
- [`react-native-create-bridge`](https://github.com/peggyrayzis/react-native-create-bridge)

## Installation

Requirements: Node 6.0+
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

  -h, --help                                output usage information
  -V, --version                             output the version number
  -p, --prefix <prefix>                     The prefix for the library (Default: `RN`)
  --module-prefix <modulePrefix>            The module prefix for the library (Default: `react-native`)
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
const createLibrary = require('create-react-native-module');

createLibrary({
  name: 'MyFancyLibrary'
}).then(() => {
  console.log('Oh yay! My library has been created!');
})
```

#### Options

```javascript
{
  name: String, /* The name of the library (Default: Library) */
  prefix: String, /* The prefix for the library (Default: RN) */
  modulePrefix: String, /* The module prefix for the library (Default: react-native) */
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

## SOME KNOWN ISSUES

- CLI does not output the correct path of the generated library module
- outdated dependencies
- not all documented options work as documented
- not all options are documented

## Behavior not tested

- Windows platform support

## Acknowledgements

- [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library) - original basis of this project
- [`react-native-share`](https://www.npmjs.com/package/react-native-share) - was acknowledged as "a great source of inspiration" for [`react-native-create-library`](https://www.npmjs.com/package/react-native-create-library)

## License

MIT
