'use strict'

const processmanager = require('../lib/process')
const log = require('../lib/log4js')

class AdminSlash extends require('../base/slash') {
  constructor () {
    super()

    this.name = 'admin'
  }

  execute (client, args) {
    const subcommand = args[0]
    switch (subcommand.name) {
      case 'reboot': {
        log.fatal('reboot')
        processmanager.shutdown()
        return 'rebooting...'
      }

      case 'user': {
        const userId = subcommand.options.find(item => item.name === 'user').value
        client.users.fetch(userId)
          .then(user => {
            log.warn(user)
          })
        return '501'
      }

      default:
        this.unknown(subcommand.name)
    }
  }
}

module.exports = new AdminSlash()
