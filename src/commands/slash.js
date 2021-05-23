'use strict'

const log = require('../lib/log4js')
const api = require('../lib/api')

module.exports = {
  name: 'slash',
  description: 'manage slash commands',

  async list (appId) {
    return await api.get(`/applications/${appId}/commands`)
      .then(json => {
        return json
      })
      .catch(err => {
        log.fatal('ERROR', err)
      })
  },

  async execute (message, args) {
    // const b = message.client.behavior
    if (args.length) {
      const appId = message.client.user.id
      const subcommand = args.shift().toLowerCase()

      switch (subcommand) {
        case 'list': {
          return this.list(appId)
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
              message.reply(content)
            })
            .catch(err => {
              log.fatal('ERROR', err)
            })
        } // case 'list'

        case 'detail': {
          if (args.length < 1) {
            message.reply('input command name')
            return
          }

          const name = args.shift().toLowerCase()
          const list = await this.list(appId)
            .catch(err => {
              log.fatal('ERROR', err)
            })
          const command = list.find(item => item.name === name)
          if (!command) {
            message.reply(`command **${name}** not found`)
            return
          }
          log.info(command)

          return await api.get(`/applications/${appId}/commands/${command.id}`)
            .then(json => {
              log.info(json)
              const jsonString = JSON.stringify(json)
              // sender.send(b.channel, 'see console')
              const content = [
                `**name** : ${json.name}`,
                `**description** : ${json.description}`,
                `**json** : ${jsonString}`
              ]
              message.reply(content)
            })
            .catch(e => {
              log.fatal('api error : ', e)
              return e
            })
        } // case 'show'

        case 'delete': {
          if (args.length < 1) {
            message.reply('input command name')
            return
          }

          const name = args.shift().toLowerCase()
          const list = await this.list(appId)
            .catch(err => {
              log.fatal('ERROR', err)
            })
          const command = list.find(item => item.name === name)
          if (!command) {
            message.reply(`command **${name}** not found`)
            return
          }
          log.info(command)

          return await api.delete(`/applications/${appId}/commands/${command.id}`)
            .then(json => {
              message.reply('success')
            })
            .catch(e => {
              log.fatal('api error : ', e)
              return e
            })
        } // case 'delete'
      } // switch
    }
    const help = [
      '**slash command**',
      '  `slash list` : Show all slash commands',
      '  `slash detail [name]` : Show detail of slash command',
      '  `slash delete [name]` : Delete slash command'
    ]
    message.reply(help)
  } // execute()
}
