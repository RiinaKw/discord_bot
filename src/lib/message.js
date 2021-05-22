'use strict'

const log = require('./log4js')

module.exports = {
  send: (channel, content, params) => {
    if (params === undefined) {
      params = {}
    }
    channel.send(content, params)
      .then(message => log.trace(`sent message: ${content}`))
      .catch(console.error)
  },
  reply: (message, content) => {
    message.reply(content)
      .then(message => log.trace(`reply message: ${content}`))
      .catch(console.error)
  }
}
