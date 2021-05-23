'use strict'

const processmanager = require('../lib/process')
const log = require('../lib/log4js')

module.exports = {
  execute (client, args) {
    const subcommand = args[0]
    switch (subcommand.name) {
      case 'reboot': {
        log.fatal('reboot')
        processmanager.shutdown()
        return 'rebooting...'
      }
      default:
        return `unknwon command \`admin ${subcommand.name}\``
    }
  }
}
