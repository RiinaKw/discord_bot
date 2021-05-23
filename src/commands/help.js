'use strict'

const sender = require('../lib/message')

module.exports = {
  name: 'help',
  description: 'show help message',
  execute (message, args) {
    const { commands } = message.client

    if (!args.length) {
      message.reply(commands.map(command => command.name).join(', '))
    } else {
      const name = args[0]
      const command = commands.get(name)
      const help = []

      console.log(command)

      help.push(`**Name:** ${command.name}`)
      if (command.aliases) help.push(`**Aliases:** ${command.aliases.join(', ')}`)
      if (command.description) help.push(`**Description:** ${command.description}`)
      if (command.usage) help.push(`**Usage:** ${command.name} ${command.usage}`)

      help.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

      sender.send(message.channel, help)
    }
  }
}
