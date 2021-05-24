'use strict'

// 参考 : https://discordjs.guide/command-handling/adding-features.html#reloading-commands

const fs = require('fs')
const log = require('../lib/log4js')

class Reload extends require('../base/command') {
  constructor () {
    super()

    this.name = 'reload'
    this.description = 'Reload a command'
    this.permissions = 'ADMINISTRATOR'
    this.usage = '  simply type `reload`'
    this.args = true
  }

  execute (message, args) {
    if (args.length < 2) {
      return message.reply('require argument')
    }

    const category = args.shift().toLowerCase()
    const target = args.shift().toLowerCase()

    let name
    let commandFile
    let commandDir
    try {
      switch (category) {
        case 'local': {
          const command =
            message.client.commands.get(target) ||
            message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(target))

          if (!command) {
            return message.reply(
              `There is no command with name or alias \`${target}\``
            )
          }

          name = command.name
          commandDir = `${__dirname}/../commands`
          break
        }

        case 'slash': {
          name = target
          commandDir = `${__dirname}/../slashes`
          break
        }

        default:
          throw new Error(`unknown category \`${category}\``)
      }

      const path = `${commandDir}/${name}.js`

      fs.open(path, 'r', (err, fd) => {
        if (err) log.fatal(err)
      })
      commandFile = require.resolve(path)
    } catch (e) {
      return message.reply(e.message)
    }

    log.info('command file : ', commandFile)
    delete require.cache[commandFile]

    try {
      const newCommand = require(commandFile)
      switch (category) {
        case 'local': {
          message.client.commands.set(newCommand.name, newCommand)
          message.channel.send(`Command \`${newCommand.name}\` was reloaded!`)
          break
        }
        case 'slash': {
          message.channel.send(`Command \`${target}\` was reloaded!`)
          break
        }
      }
    } catch (e) {
      log.fatal(e)
      message.channel.send(
        `There was an error while reloading a command \`${name}\`:\n\`${e.message}\``
      )
    }
  }
}

module.exports = new Reload()
