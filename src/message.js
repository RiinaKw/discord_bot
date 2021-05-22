'use strict'

const moment = require('moment')

module.exports = {
  send: (channel, content, params) => {
    if (params === undefined) {
      params = {}
    }
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    channel.send(content, params)
      .then(message => console.log(`${now}, sent message: ${content}`))
      .catch(console.error)
  },
  reply: (message, content) => {
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    message.reply(content)
      .then(message => console.log(`${now}, sent message: ${content}`))
      .catch(console.error)
  }
}
