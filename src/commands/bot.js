'use strict'

const sender = require('../lib/message')
const log = require('../lib/log4js')
const dbConfig = require('../model/config')

module.exports = {
  name: 'bot',
  description: 'bot commands',
  execute (message, args) {
    const b = message.client.behavior
    if (args.length) {
      const command = args.shift().toLowerCase()
      switch (command) {
        case 'interval': {
          if (args.length) {
            const amount = parseInt(args.shift())
            if (!isNaN(amount)) {
              // change interval time
              b.intervalPerMinutes = amount
              b.interval(true)
              dbConfig.update('interval', amount)

              sender.send(
                b.channel,
                `bot mode : set interval to ${amount} minutes`
              )
              log.info(`bot interval changed : ${amount} minutes`)
              return
            }
          }
          // show current interval
          const next = b.nextInterval()
          const content = [
            '**bot interval** :',
            `  current interval is \`${b.intervalPerMinutes} minutes\``,
            `  next interval is \`${next}\``
          ]
          sender.send(b.channel, content)
          return
        } // case 'interval'

        case 'slash': {
          if (args.length) {
            const appId = message.client.user.id
            const subcommand = args.shift().toLowerCase()

            switch (subcommand) {
              case 'list': {
                const api = require('../lib/api')
                api.get(`/applications/${appId}/commands`)
                  .then(json => {
                    sender.send(b.channel, '**slash command list**')
                    json.forEach(command => {
                      // console.log(command)
                      const content = [
                        `  **${command.name}** :`,
                        `    id : ${command.id}`,
                        `    description : ${command.description}`
                      ]
                      sender.send(b.channel, content)
                    })
                  })
                  .catch(err => {
                    log.fatal('ERROR', err)
                  })
                return
              } // case 'list'

              case 'show': {
                if (args.length) {
                  const id = args.shift().toLowerCase()
                  console.log(id)
                  const api = require('../lib/api')
                  api.get(`/applications/${appId}/commands/${id}`)
                    .then(json => {
                      log.info(json)
                      sender.send(b.channel, 'see console')
                    })
                    .catch(err => {
                      log.fatal('ERROR', err)
                    })
                }
                return
              } // case 'show'

              case 'delete': {
                if (args.length) {
                  const id = args.shift().toLowerCase()
                  console.log(id)
                  const api = require('../lib/api')
                  api.delete(`/applications/${appId}/commands/${id}`)
                    .then(json => {
                      log.info(json)
                      sender.send(b.channel, 'see console')
                    })
                    .catch(err => {
                      log.fatal('ERROR', err)
                    })
                }
                return
              } // case 'delete'
            } // switch
          }
          sender.send(b.channel, 'slash!')
          return
        }
      } // switch
    } // if (args.length)

    // help
    const content = [
      '**bot command**',
      '`bot interval` : Display automatic notification interval as minutes.',
      '  `bot interval (5|10|15|20|30|60)` : ',
      '    Change the automatic notification intercal, specify the minutes.',
      '  `bot interval next` : ',
      '    Show next time for the automatic notification.'
    ]
    sender.send(b.channel, content)
  }
}
