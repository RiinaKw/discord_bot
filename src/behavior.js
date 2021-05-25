'use strict'

const moment = require('moment')
const fs = require('fs')
const path = require('path')
const log = require('./lib/log4js')

let app

module.exports = a => {
  app = a
}

class Behavior {
  async init (client) {
    await app.init(client)

    // load commands
    this.loadCommand(client)

    this.intervalPerMinutes = app.config.get('interval')
    this.commandPrefix = app.config.get('commandPrefix')

    this.interval(true)

    const channelName = app.config.get('channel')
    client.guilds.cache.forEach(guild => {
      let channel = guild.channels.cache.find(ch => ch.name === channelName)
      if (!channel) {
        // fallback channel : first TextChannel
        channel = guild.channels.cache.find(ch => ch.constructor.name === 'TextChannel')
      }
      app.initMessage(client, channel)
      this.channel = channel
    })

    client.behavior = this
  } // function init()

  loadCommand (client) {
    client.commands = require('./lib/collection')
    const dir = path.resolve(__dirname, 'commands')
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'))
    commandFiles.forEach(file => {
      const command = require(`${dir}/${file}`)
      // set a new item in the Collection
      // with the key as the command name and the value as the exported module
      client.commands.set(command.name, command)
    })
  }

  interval (boot) {
    if (Number(this.intervalPerMinutes) <= 0) {
      throw new Error('interval must be greater than zero')
    }

    if (!boot) {
      app.interval(this.channel)
    }

    const time = moment()
    this.prevIntervalTime = time
    this.intervalNextMinutes =
      this.intervalPerMinutes -
      parseInt(time.minutes() % this.intervalPerMinutes)
    if (this.intervalNextMinutes <= 0) {
      this.intervalNextMinutes = this.intervalPerMinutes
    }
    this.intervalNextSeconds = (this.intervalNextMinutes * 60 - time.seconds())
    clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(
      () => { this.interval(false) },
      this.intervalNextSeconds * 1000
    )
  } // function interval()

  nextInterval () {
    const next = this.prevIntervalTime.add(this.intervalNextSeconds, 'seconds')
    return next.format('YYYY-MM-DD HH:mm:ss')
  } // function nextInterval()

  command (message) {
    const client = message.client
    if (!message.content.startsWith(this.commandPrefix)) return

    const args = message.content.slice(this.commandPrefix.length).trim().split(/ +/)
    const name = args.shift().toLowerCase()

    if (!client.commands.has(name)) {
      message.reply(`unknown command : **${name}**`)
      return false
    }
    const command = client.commands.get(name)

    try {
      log.warn(command, args)

      if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author)
        if (!authorPerms || !authorPerms.has(command.permissions)) {
          message.reply('403 Permission denied')
          return true
        }
      }

      command.execute(message, args)
      return true
    } catch (err) {
      console.log(err)
      message.reply('there was an error trying to execute that command!')
    }

    return false
  }

  message (message) {
    this.command(message)
  } // function message()

  mention (message) {
    const content = message.content
    const match = content.match(/^<@!?\d+>\s+(?<body>.*)$/)
    const body = match.groups.body

    if (!app.reply(message, body)) {
      app.replyDefault(message, body)
    }
  } // function mention()
} // class Behavior

require('./bot')(new Behavior())
