'use strict'

const log = require('../lib/log4js')
const config = require('../model/config')

module.exports = {
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
          b.intervalPerMinutes = minutes
          b.interval(true)
          config.update('interval', minutes)

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
      default:
        return `unknwon command \`bot ${subcommand.name}\``
    }
  }
}
