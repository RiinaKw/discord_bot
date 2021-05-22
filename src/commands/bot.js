'use strict'

const sender = require('../message')
const log = require('../lib/log4js')

module.exports = {
  name: 'bot',
  description: 'bot commands',
  execute (message, args) {
    const b = message.client.behavior
    if (args.length) {
      const subcommand = args.shift().toLowerCase()
      if (subcommand === 'interval') {
        if (args.length) {
          const amount = parseInt(args.shift())
          if (!isNaN(amount)) {
            // change interval time
            b.intervalPerMinutes = amount
            b.interval(true)
            sender.send(
              b.channel,
              `bot mode : set interval to ${b.intervalPerMinutes} minutes`
            )
            log.info(`bot interval changed : ${b.intervalPerMinutes} minutes`)
            return
          }
        }
        // show current interval
        const next = b.nextInterval()
        sender.send(
          b.channel,
          '**bot mode** :\n' +
          `  current interval is \`${b.intervalPerMinutes} minutes\`\n` +
          `  next interval is \`${next}\``
        )
        return
      }
    }

    // help
    const content = '**bot command**\n' +
      '`bot interval` : Display automatic notification interval as minutes.\n' +
      '  `bot interval (5|10|15|20|30|60)` : \n' +
      '    Change the automatic notification intercal, specify the minutes.\n' +
      '  `bot interval next` : \n' +
      '    Show next time for the automatic notification.'
    sender.send(b.channel, content)
  }
}
