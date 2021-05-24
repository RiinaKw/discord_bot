'use strict'

const moment = require('moment')
const sender = require('../lib/message')
const log = require('../lib/log4js')
const reminder = require('../model/reminder')

module.exports = {
  name: 'reminder',
  description: 'reminder manager, type `reminder help` to get more help',
  usage: [
    '  `reminder all` : ',
    '    Show all registered reminders.',
    '  `reminder expired` : ',
    '    Show expired registered reminders.',
    '  `reminder register [title] [datetime]` : ',
    '    Register reminder with datetime as deadline.',
    '  `reminder delete [title]` : ',
    '    Delete reminder which title matched.'
  ],

  execute (message, args) {
    if (args.length) {
      const command = args.shift().toLowerCase()
      switch (command) {
        case 'all':
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
          return

        case 'expired':
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
          return

        case 'register':
          if (args.length >= 2) {
            const [title, date, time] = args
            let deadline = date
            if (time) {
              deadline += ' ' + time
            }
            const deadlineFormatted = moment(deadline).format('YYYY-MM-DD HH:mm:ss')

            reminder.insert(message.author.id, title, deadlineFormatted)
              .then(rows => {
                log.debug(rows)
                sender.reply(message, 'accepted.')
              })
              .catch(err => {
                log.fatal(err)
                sender.reply(message, '[error] fail to accept.')
              })
            return
          }
          break

        case 'delete':
          if (args.length >= 1) {
            const [title] = args
            reminder.delete(message.author.id, title)
              .then(rows => {
                log.debug(rows)
                sender.reply(message, 'accepted.')
              })
              .catch(err => {
                log.fatal(err)
                sender.reply(message, '[error] fail to accept.')
              })
            return
          }
          break

        case 'help':
          break

        default:
          sender.reply(message, `invalid command : ${command}`)
          break
      } // switch
    } // if (command)

    const help = [
      '**reminder commands**',
      '  `reminder all` : ',
      '    Show all registered reminders.',
      '  `reminder expired` : ',
      '    Show expired registered reminders.',
      '  `reminder register [title] [datetime]` : ',
      '    Register reminder with datetime as deadline.',
      '  `reminder delete [title]` : ',
      '    Delete reminder which title matched.'
    ]
    sender.reply(message, help)
  }
}
