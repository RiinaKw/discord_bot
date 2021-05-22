'use strict'

const sender = require('../message')
const log = require('../lib/log4js')

module.exports = {
  name: 'reboot',
  description: 'shutdown and reboot this bot (needs ADMINISTRATOR permission)',
  permissions: 'ADMINISTRATOR',
  execute (message, args) {
    sender.send(message.channel, 'rebooting...')
    log.fatal('reboot')
    setTimeout(
      () => { process.exit(0) },
      1000
    )
  }
}
