'use strict'

const moment = require('moment')
const log = require('./lib/log4js')

let app

module.exports = a => {
  app = a
}

class Behavior {
  init (client, channel) {
    this.channel = channel
    // this.timeoutId;
    this.intervalPerMinutes = app.defaultIntervalMinutes()
    // this.intervalNextMinutes;
    // this.intervalNextSeconds;
    // this.prevIntervalTime;
    this.interval(true)

    client.behavior = this
    app.init(client, channel)
  } // function init()

  channelName () {
    return app.channelName()
  } // function channelName()

  interval (boot) {
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
    const content = message.content
    const match = content.match(/^<@!?\d+>\s+(?<body>.*)$/)
    const body = match.groups.body

    const args = body.trim().split(/\s+/)
    const name = args.shift().toLowerCase()

    if (!client.commands.has(name)) {
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
    app.message(message)
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
