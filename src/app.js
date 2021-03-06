'use strict'

const moment = require('moment')
const sender = require('./lib/message')
const log = require('./lib/log4js')

const reminder = require('./model/reminder')

class App {
  async init (client) {
    log.trace('initialize app layer')

    client.app = this
  } // function init()

  initMessage (channel) {
    sender.send(channel, 'Ready go.')
  }

  interval (channel) {
    const content = moment().format('YYYY-MM-DD HH:mm:ss')
    sender.send(channel, content)

    reminder.selectExpired()
      .then(rows => {
        rows.forEach(row => {
          log.trace(row)
          const deadline = moment(row.deadline).format('YYYY-MM-DD HH:mm:ss')
          sender.send(channel, `reminder : ${row.name}, deadline is ${deadline}`, {
            reply: row.user_id
          })
        })
      })
  } // function interval()

  message (message) {
    // process here if you wanna reply to the message
    /*
    let content = message.content
    let channel = message.channel
    let author = message.author.username
    sender.reply(message, content)
    */
  } // function message()

  reply (message, body) {
  } // function reply()

  replyDefault (message, body) {
    // reply for message
    const content = 'Hi, there.'
    sender.reply(message, content)
  } // function replyDefault()
} // class App

const app = new App()
require('./behavior')(app)

module.exports = app
