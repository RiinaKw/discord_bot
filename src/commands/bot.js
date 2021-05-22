'use strict'

const sender = require('../lib/message')
const log = require('../lib/log4js')

module.exports = {
  name: 'bot',
  description: 'bot commands',
  execute (message, args) {
    const b = message.client.behavior
    if (args.length) {
      const command = args.shift().toLowerCase()
      switch (command) {
        case 'interval': {
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
          const content = [
            '**bot interval** :',
            `  current interval is \`${b.intervalPerMinutes} minutes\``,
            `  next interval is \`${next}\``
          ]
          sender.send(b.channel, content)
          return
        }
      } // switch
    } // if (args.length)

    // help
    const content = [
      '**bot command**',
      '`bot interval` : Display automatic notification interval as minutes.',
      '  `bot interval (5|10|15|20|30|60)` : ',
      '    Change the automatic notification intercal, specify the minutes.',
      '  `bot interval next` : ',
      '    Show next time for the automatic notification.'
    ]
    sender.send(b.channel, content)
  }
}
