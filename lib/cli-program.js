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
    command.func(arguments, {}, this.opts());
  });

(command.options || [])
  .forEach(opt => program.option(
    opt.command,
    opt.description,
    opt.parse || (value => value),
    opt.default
  ));

const args = process.argv;
if (args.length === 2) {
  args.push('--help');
}
program.parse(args);
