const program = require('commander');
const updateNotifier = require('update-notifier');

const command = require('./cli-command');
const pkg = require('./../package.json');

const MIN_CLI_ARGS_LENGTH = 3;

updateNotifier({ pkg }).notify();

program
  .version(pkg.version)
  .usage(command.usage)
  .description(command.description)
  .action(function runAction () {
    command.func(arguments, {}, this.opts());
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
