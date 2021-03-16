const { paramCase } = require('param-case');

const { pascalCase } = require('pascal-case');

// TODO: refactor all defaults from here & lib.js into a new module
// (and rename this const)
const DEFAULT_MODULE_PREFIX = 'react-native';

module.exports = (options) => {
  const { name, moduleName, objectClassName } = options;

  // TODO: replace with (renamed) constant in the code below
  const modulePrefix = options.modulePrefix || DEFAULT_MODULE_PREFIX;

  if (typeof name !== 'string') {
    throw new TypeError("Please write your library's name");
  }

  // namespace - library API member removed since Windows platform
  // is now removed (may be added back someday in the future)
  // const namespace = options.namespace;

  return Object.assign(
    { name },
    options,
    moduleName
      ? {}
      : { moduleName: `${modulePrefix}-${paramCase(name)}` },
    objectClassName
      ? {}
      : { objectClassName: `${pascalCase(name)}` },
    // namespace - library API member removed since Windows platform
    // is now removed (may be added back someday in the future)
    // namespace
    //   ? {}
    //   : { namespace: pascalCase(name).split(/(?=[A-Z])/).join('.') },
  );
};
