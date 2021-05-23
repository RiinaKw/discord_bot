'use strict'

const sender = require('../../lib/message')
const log = require('../../lib/log4js')

module.exports = {
  name: 'slash',
  description: 'bot slash commands',
  execute (message, args) {
    const b = message.client.behavior
    if (args.length) {
      const appId = message.client.user.id
      const subcommand = args.shift().toLowerCase()

      switch (subcommand) {
        case 'list': {
          const api = require('../../lib/api')
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
  } // execute()
}
