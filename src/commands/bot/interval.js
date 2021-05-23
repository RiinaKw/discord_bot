'use strict'

const log = require('../../lib/log4js')
const config = require('../../model/config')

module.exports = {
  name: 'interval',
  description: 'Display automatic notification interval as minutes.',
  execute (message, args) {
    const b = message.client.behavior
    if (args.length) {
      const arg = args.shift()
      if (arg === 'help') {
        return [
          '**bot interval command** :',
          '  `bot interval help` : this message',
          '  `bot interval` : Display automatic notification interval as minutes.',
          '  `bot interval (5|10|15|20|30|60)` : ',
          '    Change the automatic notification intercal, specify the minutes.',
          '  `bot interval next` : ',
          '    Show next time for the automatic notification.'
        ]
      }
      const amount = parseInt(arg)
      if (!isNaN(amount)) {
        // change interval time
        b.intervalPerMinutes = amount
        b.interval(true)
        config.update('interval', amount)

        log.info(`bot interval changed : ${amount} minutes`)
        return `bot mode : set interval to ${amount} minutes`
      }
    }
    // show current interval
    const next = b.nextInterval()
    return [
      '**bot interval** :',
      `  current interval is \`${b.intervalPerMinutes} minutes\``,
      `  next interval is \`${next}\``
    ]
  } // execute()
}
