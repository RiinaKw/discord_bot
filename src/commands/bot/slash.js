'use strict'

const log = require('../../lib/log4js')
const api = require('../../lib/api')

module.exports = {
  name: 'slash',
  description: 'bot slash commands',
  async execute (message, args) {
    // const b = message.client.behavior
    if (args.length) {
      const appId = message.client.user.id
      const subcommand = args.shift().toLowerCase()

      switch (subcommand) {
        case 'list': {
          return await api.get(`/applications/${appId}/commands`)
            .then(json => {
              const content = []
              content.push('**slash command list**')
              json.forEach(command => {
                const text = [
                  `  \`${command.name}\` :`,
                  `    **id** : ${command.id}`,
                  `    **description** : ${command.description}`
                ].join('\n')
                content.push(text)
              })
              return content
            })
            .catch(err => {
              log.fatal('ERROR', err)
            })
        } // case 'list'

        case 'detail': {
          if (args.length) {
            const id = args.shift().toLowerCase()
            return await api.get(`/applications/${appId}/commands/${id}`)
              .then(json => {
                log.info(json)
                const jsonString = JSON.stringify(json)
                // sender.send(b.channel, 'see console')
                const content = [
                  `**name** : ${json.name}`,
                  `**description** : ${json.description}`,
                  `**json** : ${jsonString}`
                ]
                return content
              })
              .catch(e => {
                log.fatal('api error : ', e)
                return e
              })
          }
          return 'show command'
        } // case 'show'

        case 'delete': {
          if (args.length) {
            const id = args.shift().toLowerCase()
            return await api.delete(`/applications/${appId}/commands/${id}`)
              .then(json => {
                log.info(json)
                // sender.send(b.channel, 'see console')
                return 'see console'
              })
              .catch(e => {
                log.fatal('api error : ', e)
                return e
              })
          }
          return
        } // case 'delete'
      } // switch
    }
    return [
      '**bot slash command**',
      '  `bot slash list` : Show all slash commands',
      '  `bot slash detail [id]` : Show detail of slash command',
      '  `bot slash delete [id]` : Delete slash command'
    ]
  } // execute()
}
