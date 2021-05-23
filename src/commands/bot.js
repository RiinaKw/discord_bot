'use strict'

const fs = require('fs')
const sender = require('../lib/message')
const log = require('../lib/log4js')

const commands = require('../lib/collection')
try {
  const dir = `${__dirname}/bot`
  const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'))
  commandFiles.forEach(file => {
    const command = require(`${dir}/${file}`)
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    commands.set(command.name, command)
  })
} catch (err) {
  log.fatal()
}

console.log(commands)

module.exports = {
  name: 'bot',
  description: 'bot commands',
  execute (message, args) {
    const b = message.client.behavior
    if (args.length) {
      try {
        const name = args.shift().toLowerCase()
        const command = commands.get(name)
        if (!command) {
          throw new Error(`bot command not found : ${name}`)
        }
        log.debug(command)
        command.execute(message, args)
        return
      } catch (e) {
        log.fatal(e)
        sender.send(b.channel, e.message)
      }
    } // if (args.length)

    // help
    /*
    const content = [
      '**bot command**',
      '`bot interval` : Display automatic notification interval as minutes.',
      '  `bot interval (5|10|15|20|30|60)` : ',
      '    Change the automatic notification intercal, specify the minutes.',
      '  `bot interval next` : ',
      '    Show next time for the automatic notification.'
    ]
    sender.send(b.channel, content)
    */

    message.reply(commands.map(command => command.name).join(', '))
  }
}
