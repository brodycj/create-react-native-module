const { paramCase } = require('param-case');

const { pascalCase } = require('pascal-case');

const {
  DEFAULT_MODULE_PREFIX,
} = require('./constants');

module.exports = (options) => {
  const { name, moduleName, objectClassName } = options;

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
    moduleName
      ? {}
      : { moduleName: `${modulePrefix}-${paramCase(name)}` },
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
