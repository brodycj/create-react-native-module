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

program.parse(process.argv);

// TBD non-functional error handling code
// FUTURE TODO: handle missing argument error in the right place
// (see issue #48)
// if (!program.args.length) {
//   program.help();
// }
