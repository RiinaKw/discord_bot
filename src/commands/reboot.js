'use strict'

const sender = require('../lib/message')
const process = require('../lib/process')
const log = require('../lib/log4js')

module.exports = {
  name: 'reboot',
  description: 'shutdown and reboot this bot (needs ADMINISTRATOR permission)',
  permissions: 'ADMINISTRATOR',

  execute (message, args) {
    sender.send(message.channel, 'rebooting...')
    log.fatal('reboot')
    process.shutdown()
  }
}
