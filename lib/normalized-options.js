const { paramCase } = require('param-case');

const { pascalCase } = require('pascal-case');

// TODO: refactor all defaults from here & lib.js into a new module
const DEFAULT_MODULE_PREFIX = 'react-native';

module.exports = (options) => {
  const { name, packageName, objectClassName } = options;

  const prefix = options.prefix || '';

  const modulePrefix = options.modulePrefix || DEFAULT_MODULE_PREFIX;

  if (typeof name !== 'string') {
    throw new TypeError("Please write your library's name");
  }

  // namespace - library API member removed since Windows platform
  // is now removed (may be added back someday in the future)
  // const namespace = options.namespace;

  return Object.assign(
    { name, prefix, modulePrefix },
    options,
    packageName
      ? {}
      : { packageName: `${modulePrefix}-${paramCase(name)}` },
    objectClassName
      ? {}
      : { objectClassName: `${prefix}${pascalCase(name)}` },
    // namespace - library API member removed since Windows platform
    // is now removed (may be added back someday in the future)
    // namespace
    //   ? {}
    //   : { namespace: pascalCase(name).split(/(?=[A-Z])/).join('.') },
  );
};
