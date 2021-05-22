'use strict'

module.exports = {
  name: 'help',
  description: 'show help message',
  execute (message, args) {
    const { commands } = message.client
    const data = []

    if (!args.length) {
      message.reply(commands.map(command => command.name).join(', '))
    } else {
      const name = args[0]
      const command = commands.get(name)

      data.push(`**Name:** ${command.name}`)
      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`)
      if (command.description) data.push(`**Description:** ${command.description}`)
      if (command.usage) data.push(`**Usage:** ${command.name} ${command.usage}`)

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

      message.channel.send(data, { split: true })
    }
  }
}
