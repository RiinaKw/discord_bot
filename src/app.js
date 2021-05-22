'use strict'

const moment = require('moment')
const sender = require('./message')
const log = require('./lib/log4js')

const config = require('../config/global')
const reminder = require('../model/reminder')

class App {
  init (client, channel) {
    sender.send(channel, 'Ready go.')
    if (config.activity) {
      client.user.setPresence({ activity: config.activity })
    }
    client.app = this
  } // function init()

  channelName () {
    return config.channel || 'general'
  } // function channelName()

  defaultIntervalMinutes () {
    return config.interval || 60
  } // function defaultIntervalMinutes()

  interval (channel) {
    const content = moment().format('YYYY-MM-DD HH:mm:ss')
    sender.send(channel, content)

    reminder.selectExpired()
      .then(rows => {
        rows.forEach(row => {
          log.debug(row)
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
    let match
    if (match = body.match(/^reminder expired(\s|$)/)) {
      reminder.selectExpired(message.author.id)
        .then(rows => {
          if (rows.length > 0) {
            rows.forEach(row => {
              log.debug(row)
              const deadline = moment(row.deadline).format('YYYY-MM-DD HH:mm:ss')
              sender.reply(message, `${row.name}, deadline is ${deadline}`)
            })
          } else {
            sender.reply(message, 'no reminder expired')
          }
        })
      return true
    } else if (match = body.match(/^reminder all(\s|$)/)) {
      reminder.selectAll(message.author.id)
        .then(rows => {
          if (rows.length > 0) {
            rows.forEach(row => {
              log.debug(row)
              const deadline = moment(row.deadline).format('YYYY-MM-DD HH:mm:ss')
              sender.reply(message, `${row.name}, deadline is ${deadline}`)
            })
          } else {
            sender.reply(message, 'no reminder')
          }
        })
      return true
    } else if (match = body.match(/^register reminder\s+(?<name>.+?)\s+(?<deadline>.+?)$/)) {
      const name = match.groups.name
      const deadline = moment(match.groups.deadline).format('YYYY-MM-DD HH:mm:ss')

      reminder.insert(message.author.id, name, deadline)
        .then(rows => {
          console.log(rows)
          sender.reply(message, 'accepted.')
        })
        .catch(err => {
          console.log(err)
          sender.reply(message, '[error] fail to accept.')
        })
      return true
    } else if (match = body.match(/^delete reminder\s+(?<name>.+?)$/)) {
      const name = match.groups.name
      reminder.delete(message.author.id, name)
        .then(rows => {
          console.log(rows)
          sender.reply(message, 'accepted.')
        })
        .catch(err => {
          console.log(err)
          sender.reply(message, '[error] fail to accept.')
        })
      return true
    } else if (match = body.match(/^reboot$/)) {
      sender.reply(message, 'reboot')
      // trigger error, non-existing function
      boo()
      return true
    }
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
