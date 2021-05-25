'use strict'

const log = require('../lib/log4js')

class BotSlash extends require('../base/slash') {
  constructor () {
    super()

    this.name = 'bot'
  }

  execute (client, args) {
    const subcommand = args[0]
    switch (subcommand.name) {
      case 'interval': {
        const b = client.behavior
        if (subcommand.options) {
          const minutes = subcommand.options.find(item => item.name === 'minutes').value
          if (minutes <= 0) {
            throw new Error('**bot interval error** : minutes must be greater than zero')
          }

          // change interval time
          b.intervalPerMinutes = client.app.config.set('interval', minutes)
          b.interval(true)

          log.info(`bot interval changed : ${minutes} minutes`)
          return `**bot interval** : set to ${minutes} minutes`
        } else {
          // show current interval
          const next = b.nextInterval()
          return [
            '**bot interval** :',
            `  current interval is \`${b.intervalPerMinutes} minutes\``,
            `  next interval is \`${next}\``
          ]
        }
      }

      case 'author':
        return subcommand.options.find(item => item.name === 'type').value

      default:
        this.unknown(subcommand.name)
    }
  }
}

module.exports = new BotSlash()
