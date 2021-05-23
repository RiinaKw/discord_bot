'use strict'

const log = require('../lib/log4js')
const config = require('../model/config')

module.exports = {
  execute (client, args) {
    const command = args.find(item => item.name === 'command')
    const subcommand = command.options[0].name
    switch (subcommand) {
      case 'interval': {
        const b = client.behavior
        const interval = command.options.find(item => item.name === 'interval')
        log.fatal('interval', interval)
        if (interval.options) {
          const minutes = interval.options.find(item => item.name === 'minutes')
          if (minutes.value <= 0) {
            throw new Error('minutes must be greater than zero')
          }

          // change interval time
          b.intervalPerMinutes = minutes.value
          b.interval(true)
          config.update('interval', minutes.value)

          log.info(`bot interval changed : ${minutes.value} minutes`)
          return `**bot interval** : set to ${minutes.value} minutes`
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
      default:
        return `try to execute **bot ${subcommand}**`
    }
  }
}
