const program = require('commander');
const updateNotifier = require('update-notifier');

const command = require('./cli-command');
const pkg = require('./../package.json');

updateNotifier({ pkg }).notify();

program
  .version(pkg.version)
  .usage(command.usage)
  .description(command.description)
  .action(function runAction () {
    if (!arguments.length) return program.help();
    command.func(arguments, {}, this.opts());
  });

(command.options || [])
  .forEach(opt => program.option(
    opt.command,
    opt.description,
    opt.parse || (value => value),
    opt.default
  ));

program.parse(process.argv);
