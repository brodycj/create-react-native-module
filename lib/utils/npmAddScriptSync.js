const jsonfile = require('jsonfile');

// Add a script entry to a package.json file at the packageJsonPath.
// The script parameter shoud be of {key: key, value: value}
// Now with a mockable fs object parameter
module.exports = (packageJsonPath, script, fs) => {
  try {
    var packageJson = jsonfile.readFileSync(packageJsonPath, { fs });
    if (!packageJson.scripts) packageJson.scripts = {};
    packageJson.scripts[script.key] = script.value;
    jsonfile.writeFileSync(packageJsonPath, packageJson, { fs, spaces: 2 });
  } catch (e) {
    if (/ENOENT.*package.json/.test(e.message)) {
      throw new Error(`The package.json at path: ${packageJsonPath} does not exist.`);
    } else {
      throw e;
    }
  }
};
