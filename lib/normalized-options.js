const { paramCase } = require('param-case');

const { pascalCase } = require('pascal-case');

const PACKAGE_PREFIX = 'react-native';

module.exports = (options) => {
  const { name, packageName, objectClassName } = options;

  if (typeof name !== 'string') {
    throw new TypeError("Please write your library's name");
  }

  // namespace - library API member removed since Windows platform
  // is now removed (may be added back someday in the future)
  // const namespace = options.namespace;

  return Object.assign(
    { name },
    options,
    packageName
      ? {}
      : {
        // TODO: do not add PACKAGE_PREFIX if it is not needed
        packageName: `${PACKAGE_PREFIX}-${paramCase(name)}`
      },
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
