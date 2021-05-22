'use strict'

const sender = require('../message')

module.exports = {
  name: 'reboot',
  description: 'shutdown and reboot this bot (needs ADMINISTRATOR permission)',
  permissions: 'ADMINISTRATOR',
  execute (message, args) {
    const a = message.client.app
    sender.send(message.channel, 'rebooting...')

    // trigger error, non-existing function
    setTimeout(
      () => { a.killmyself() },
      1000
    )
  }
}
