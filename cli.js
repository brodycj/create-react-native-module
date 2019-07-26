#!/usr/bin/env node

const program = require('commander')
const updateNotifier = require('update-notifier')

const command = require('./lib/cli-command')
const pkg = require('./package.json')

const commandOptions = command.options || []

updateNotifier({ pkg }).notify()

program
  .version(pkg.version)
  .usage(command.usage)
  .description(command.description)
  .action(function runAction () {
    command.func(arguments, {}, this.opts())
  })

commandOptions.forEach(opt =>
  program.option(opt.command, opt.description, opt.parse || (value => value), opt.default)
)

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
