'use strict'

const log = require('../lib/log4js')
const api = require('../lib/api')

module.exports = {
  async list (appId) {
    return await api.get(`/applications/${appId}/commands`)
      .catch(err => {
        log.fatal('ERROR', err)
      })
  },

  async find (appId, name) {
    const list = await this.list(appId)
      .catch(err => {
        log.fatal('ERROR', err)
      })
    const target = list.find(item => item.name === name)
    if (!target) {
      throw new Error(`command **${name}** not found`)
    }
    return target
  },

  async execute (client, args) {
    const appId = client.user.id
    const command = args.find(item => item.name === 'command')
    const subcommand = command.options[0]
    switch (subcommand.name) {
      case 'list': {
        return await this.list(appId)
          .then(json => {
            log.fatal(json)
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
        const name = subcommand.options.find(item => item.name === 'name').value
        let target
        try {
          target = await this.find(appId, name)
          log.fatal(target)
        } catch (e) {
          log.fatal(e)
          return e.message
        }

        return await api.get(`/applications/${appId}/commands/${target.id}`)
          .then(json => {
            log.info(json)
            const jsonString = JSON.stringify(json)
            return [
              `**name** : ${json.name}`,
              `**description** : ${json.description}`,
              `**json** : ${jsonString}`
            ]
          })
          .catch(e => {
            log.fatal('api error : ', e)
            return e
          })
      } // case 'detail'

      case 'delete': {
        const name = subcommand.options.find(item => item.name === 'name').value
        let target
        try {
          target = await this.find(appId, name)
          log.fatal(target)
        } catch (e) {
          log.fatal(e)
          return e.message
        }

        return await api.delete(`/applications/${appId}/commands/${target.id}`)
          .then(json => {
            return `delete **${name}** : success`
          })
          .catch(e => {
            log.fatal('api error : ', e)
            return e
          })
      } // case 'delete'

      default:
        return `unknwon subcommand **${subcommand.name}**`
    }
  }
}
