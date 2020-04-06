# Changelog

### 0.17.0

* bugfix: quick fixes to handle CLI args errors (#306)
* test cleanup: rename tests/with-mocks/cli/command/func directory
* chore: regenerate yarn.lock
* chore: jest@^25.2.7 update in devDependencies
* add & update iOS podspec license comments (#258)
* doc: minimum React Native version on 1 line (#302)
* doc: fix API & option descriptions (#301)
* chore: update change case dependencies (#298)
* chore: quick commander@5 update (#297)
* chore: add PR merge action (#296)
* chore: jest@25 update in devDependencies
* chore: update eslint items in devDependencies
* chore: @stryker-mutator/... 3.1.0 in devDependencies
* chore: add `brodybits-*` to test action branches
* add package engines & use please-upgrade-node (#295)
* cleanup: remove .travis.yml which is no longer needed
* testing: add Node.js test action to GitHub workflows (#294)
* testing: quick test workaround for Node.js 8 vs ...
* cleanup: remove library API support for namespace (#276)
* testing: updates to setup of Stryker Mutator (#272)
* remove Windows (C#) support (#264)


### 0.16.0

* use react-native@latest in example by default (#263)
* doc: update alternatives in README.md (#262)
* cleanup: refactoring: move require('uuid') out of templates (#261)
* doc: example app doc updates (quick updates) (#260)
* log more example app info in the end (#259)

### 0.15.0

* no log of generated example options unless enabled (#257)
* show hint to generate example, if needed in CLI (#256)
* chore: Bump jsonfile from 5.0.0 to 6.0.0 (#252)
* doc: fix default React Native version in lib API (#255)
* chore: Bump update-notifier from 3.0.1 to 4.1.0 (#250)

### 0.14.1

* bugfix: fix license in iOS podspec (#253)

### 0.14.0

* support React Native 0.61; drop React Native 0.59 (#244)
* chore: uuid 3.4.0 update in package dependencies (#243)
* chore: [dev] @stryker-mutator 2.5.0 updates (#242)
* chore: [dev] eslint-plugin-node@11 update (#241)
* chore: Bump eslint-plugin-import from 2.18.2 to 2.20.1 (#234)
* chore: Bump eslint from 6.6.0 to 6.8.0 (#215)
* chore: [Security - dev] Bump handlebars from 4.1.2 to 4.7.3 (#235)
* chore: add `yarn-error.log` to .gitignore (#239)

### 0.13.0

* Use javaCompileProvider in Android template (PR #120)

### 0.12.0

* cleanup: consistent iOS method spacing in generated code (#148)
* cleanup: add references & links to generated build.gradle (see PR #152)
* cleanup: move imports in generated android/build.gradle (see PR #141)
* chore: Bump execa from 2.0.4 to 3.3.0 (#180)
* cleanup: move constants in generated android/build.gradle (#140)
* cleanup: remove trailing tabs from generated podspec file (#146)
* cleanup: replace --use-cocoapods with 2 options (#167)
* make tvOS support optional (#126)
* doc fixes for tvOS platform fork (quick fixes) (#186)
* doc: Manual installation gone in generated README.md (#169)
* chore: Bump commander from 3.0.1 to 3.0.2
* lint: Bump eslint from 6.4.0 to 6.6.0
* testing: update stryker.conf.js to include templates (#170)

### 0.11.1

* cleanup: fix & clarify Android package identifier description text (#155)
* doc: Update description of `--use-cocoapods` option (#166)
* testing: test CLI command func error with logging (#162)
* fix async CLI func tests again (#160)
* CLI command function test fixes (#158)
* lint: eslint-plugin-node@10 update in devDependencies (#157)
* cleanup: move internal `npmAddScriptSync` function (#150)
* document minimum react-native-tvos version (#131)

### 0.11.0

* Update android build.gradle template setup - wraps the buildscripts dependencies in a conditional (PR #135)
* cleanup: cleanup generated android/build.gradle artifact (#138)
* bugfix: no sudo in generated doc for Android (#136)
* doc: License section back at the bottom (now as a link) (#124)
* cleanup: no-useless-escape eslint rule fix in templates (#123)
* testing: CLI create integration testing (#114)
* testing: test updates for Windows, now covered by Travis CI (#118)
* testing: Travis CI matrix, with macOS added (#117)
* testing: Stryker Mutator 2.1.0 tool updates (#116)

### 0.10.2

* unit test of missing CLI args using mocks (#111)
* bugfix: Fix crash when no args passed in
* remove duplicate `authorEmail` entry from logging (#106)

### 0.10.1

* cleanup: do not use defaults for normalized options
* testing: test prefix: null with logging using mocks
* testing: test create with example with prefix: null
* testing: test logging with custom prefix 'ABC' using mocks
* cleanup: no normalization of platforms in lib/cli-command.js
* testing: test bogus values of platforms with mocking
* testing: unit test bogus values of platforms with injection
* doc: general status updates for 0.10.x (#104)

### 0.10.0

* Update minimum iOS version to 9.0 (#92)
* document status of out-of-tree platform support (#97)
* doc React Native 0.60 support quirk (#96)
* Adding tvOS support (#91)
* commander@3 update (#80)
* testing: add test with name in camel case
* testing: test create with custom moduleName
* testing: test with custom modulePrefix (for Android & iOS)
* testing: test with custom prefix for Android & iOS
* testing: test generated example with `useCocoapods: true`
* testing: test with `useCocoapods: true` for iOS


### 0.9.2

* cleanup: remove code not needed from lib/normalized-options.js (#85)

### 0.9.1

* test & doc lib API for platforms: Array | String
* cleanup: remove code not needed from generateLibraryModule
* cleanup: comment out non-functioning CLI help code
* cleanup: remove code not needed from npmAddScriptSync.js
* testing: test lib with bogus name: null option
* testing: mocked example logging test updates
* testing: add missing packageIdentifier setting to lib test
* testing: test mocked example yarn add error with logging
* testing: test example `yarn add` failure
* testing: test error handling for missing tools
* testing: test recovery from missing example package scripts
* testing: test example package JSON errors
* test cleanup: reorganize tests with mocks into tests/with-mocks
* test cleanup: rename ioMocks to ioInject in tests/with-injection
* test cleanup: reorganize tests with injection
* testing: add Stryker mutator

### 0.9.0

* testing: test lib/cli-program.js with mocking on Android
* cleanup: Split up cli.js
* testing: quick integration test of `./cli.js --help`
* chore: execa@2.0.4 update
* chore: uuid@3.3.3 update
* quick internal cleanup for synchronous commandSync (#74)

### 0.8.0

* testing: Quick mocking of console logging in a single test
* cleanup: cleanup internal lib function names & arguments
* testing: move injection I/O options into a hidden argument
* testing: test lib-cli-command func using Jest mock
* fix func in lib/cli-command.js to return a promise
* testing: add tests/mocked-lib-windows-defaults
* testing: cleanup mocked-lib-with-config-options-windows
* testing: fully mocked library test for Windows
* testing: fully mocked library test with example
* cleanup: simpler ENOENT error message test
* cleanup: throw TypeError in case of missing name
* remove mockable jsonfile option from lib API
* cleanup: cleanup imports in lib/lib.js
* Use real execa in place of fake internal execa object
* Drop support for React Native pre-0.59
* testing: Windows unit test with config options (#70)
* testing: check cli-command object
* testing: jsonfile test updates & fixes (#68)
* cleanup internal updatePlatformInFile function (#64)
* cleanup `templates/*.js`: remove zero max-len lines (#62)
* testing: add and move some test scripts
* Merge pull request #59 from brodybits/general-test-updates

### 0.7.0

* More README.md updates for 0.7.0 (#56)
* README.md updates for 0.7.0
* MIT license by default
* Add tests with generateExample: true setting
* Add mockable jsonfile object to the library API
* fake execa object that can be mocked from the API
* factor out lib/utils/exec.js
* Fix handling of default platforms value in lib API
* Add *limited* jest testing with snapshots
* do lint in test script
* Add mockable fs Object option to library API
* Fix internal renderTemplateIfValid function
* remove mkdirp (no longer needed)
* include .swift files in podspec
* remove createFile and createFolder, in favor of using fs-extra
* Remove unused utils hasPrefix and isUppercase

### 0.6.1

* restore cli.js in package.json files list, which was accidentally removed during cleanup in #33 (#49)

### 0.6.0

* Version 0.6.0 status in README.md (#44)
* chore: remove & reinstall eslint packages in devDependencies to resolve Yarn audit issues
* cleanup: remove package items not needed (#35)
* cleanup: move some JavaScript modules into lib subdirectory (#33)
* Gradle updates in android.js (#24)
* Add exampleReactNativeVersion option
* Fix some more fields in generated podspec
* factor duplicated keys out of command.js
* Updated TODO comments in generated code
* Completely remove npm fallback for example
* Update doc for exampleName & useCocoapods options
* Cleanup & fix generateExampleWithName in lib.js
* update-notifier@3 update
* Bump version to 0.6.0-dev
* eslint updates in devDependencies
* Other lint fixes
* Quick lint fixes to templates/ios.js
* Fix hardcoded target name in example Podfile
* Remove the Podfile from library ios project, because it messes up example build
* Make TestLibrary.xcworkspace compilable on its own
* Fix formatting
* Add use cocoapods flag
* Add AFNetworking test code
* Add ios example podfile
* Add description, which is inherited and required by podspec
* Add AFNetworking pod to library as an example
* Set podspec name to module name for conventions
* Pass exampleName to comments in example template
* Pass exampleName to example template
* Fix .npmignore template to support custom example name
* support setting example project name with example project name parameter


### 0.5.0

* Update devDependencies for React Native 0.59.4
* Other generated Android build updates from RN 0.59
* Add and update badges (#16)
* Update android.js - upgrade gradle plugin to newest version

### 0.4.1

* bugfix: add normalized-options.js to files entry (#13)

### 0.4.0

* doc: Add some badges (#11)
* add @brodybits to LICENSE (#10)
* Fix defaults & help text in command.js & README.md
* Updated generated dependencies - now more flexible
* chore: commander@2.20.0 update
* chore: update devDependencies
* lib.js log updates
* chore: lib.js cleanup & refactoring
* correct module name from normalized-options.js
* Update programmatic function name
* do not import hasPrefix in lib.js
* Add '-V, --version' option
* Add exception handling when there is no library's name (#103)

### 0.3.0

* add --module-name option
* blank prefix by default
* Fix known inconsistencies in documented options
* Remove --override-prefix check
* Update generated build.gradle to match RN 0.58.6
* chore: resolve eslint issues

### 0.2.0

* lint: use eslint@5 with (semi)standard config, with no failures
* lint: add missing semicolons
* chore: update all dependencies (except for `mkdirp`) & regenerate yarn.lock
* test: Update npm test script to exit with an error

### 0.1.0

based on react-native-create-library commit e08c03cad

* Update package description & keywords
* Add example app instructions & other doc fixes
* native view option on Android & iOS
* lib.js support conditionally skipping templates
* Remove deprecated createJSModules code on Android
* Remove methodQueue method on iOS
* Drop `#if __has_include` condition on iOS
* Check for tools needed to generate example project
* document tools needed to generate example project
* add missing newlines to generated Android code
* sample method callbacks received in example app
* lib.js compute class name & namespace exactly once
* automatic module name in `examples_postinstall.js`
* remove extra spacing from the output
* remove docs/usage.gif
* Update android.js - Upgrade android gradle plugin to latest version
