'use strict'

const sender = require('../lib/message')
const process = require('../lib/process')
const log = require('../lib/log4js')

class Reboot extends require('../base/command') {
  constructor () {
    super()

    this.name = 'reboot'
    this.description = 'shutdown and reboot this bot (needs ADMINISTRATOR permission)'
    this.permissions = 'ADMINISTRATOR'
    this.usage = '  simply type `reboot`'
  }

  execute (message, args) {
    sender.send(message.channel, 'rebooting...')
    log.fatal('reboot')
    process.shutdown()
  }
}

module.exports = new Reboot()
