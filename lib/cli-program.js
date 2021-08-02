const pkg = require('./../package.json');
require('please-upgrade-node')(pkg);

const program = require('commander');

const updateNotifier = require('update-notifier');

const command = require('./cli-command');

const MIN_CLI_ARGS_LENGTH = 3;

updateNotifier({ pkg }).notify();

program
  .version(pkg.version)
  .usage(command.usage)
  .description(command.description)
  .action(function programAction (_, args) {
    command.action(args, this.opts());
  });

(command.options || [])
  .forEach(opt => program.option(
    opt.command,
    opt.description,
    opt.parse || (value => value),
    opt.default
  ));

const args =
  [].concat(
    process.argv,
    (process.argv.length < MIN_CLI_ARGS_LENGTH)
      ? '--help'
      : []
  );

program.parse(args);
