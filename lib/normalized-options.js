const { paramCase } = require('param-case');

const { pascalCase } = require('pascal-case');

const PACKAGE_NAME_PREFIX = 'react-native-';

function transformPackageName (name) {
  const paramCaseName = paramCase(name);

  return paramCaseName.startsWith(PACKAGE_NAME_PREFIX)
    ? paramCaseName
    : PACKAGE_NAME_PREFIX + paramCaseName;
}

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
      : { packageName: transformPackageName(name) },
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
