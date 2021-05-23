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

      try {
        let obj
        try {
          obj = require('./bot/' + command)
        } catch (e) {
          throw new Error(`bot command not found : ${command}`)
        }
        log.debug(obj)
        obj.execute(message, args)
      } catch (e) {
        log.fatal(e)
        sender.send(b.channel, e.message)
      }
      return
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
