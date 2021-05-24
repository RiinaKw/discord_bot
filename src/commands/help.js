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
      const response = []

      console.log(command)

      response.push(`**Name:** ${command.name}`)
      if (command.aliases) response.push(`**Aliases:** ${command.aliases.join(', ')}`)
      if (command.description) response.push(`**Description:** ${command.description}`)
      if (command.permissions) response.push(`**Permissions:** ${command.permissions}`)
      // if (command.usage) response.push(`**Usage:** ${command.name} ${command.usage}`)

      // response.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

      if (command.usage) {
        let usage = command.usage
        if (typeof usage !== 'string') usage = usage.join('\n')
        response.push(`**Usage:** \n${usage}`)
      }

      sender.send(message.channel, response)
    }
  }
}
