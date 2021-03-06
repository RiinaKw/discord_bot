'use strict'

const log = require('../lib/log4js')
const api = require('../lib/api')

const defs = require('../slash-config/commands')
const PermissionType = require('../slash-config/permissions')

class Slash extends require('../base/command') {
  constructor () {
    super()

    this.name = 'slash'
    this.description = 'manage slash commands'
    this.permissions = 'ADMINISTRATOR'
    this.usage = [
      '  `slash list` : Show all registered slash commands',
      '  `slash list-guild` : Show all registered slash commands for this guild (experimental)',
      '  `slash detail [name]` : Show detail of registered slash command',
      '  `slash delete [name]` : Delete registered slash command',
      '  `slash stored` : Show the list of stored slash commands',
      '  `slash stored [name]` : Show detail of stored slash command',
      '  `slash add [name]` : Register the stored command'
    ]
  }

  load (name) {
    const def = defs.find(def => def.param.name === name)
    if (!def) {
      throw new Error(`command **${name}** not found`)
    }
    return def
  }

  async list (appId) {
    return await api.get(`/applications/${appId}/commands`)
      .then(json => {
        return json
      })
      .catch(err => {
        log.fatal('ERROR', err)
      })
  }

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
  }

  async requireRegistered (message, args) {
    if (args.length < 1) {
      message.reply('input command name')
      return null
    }

    const appId = message.client.user.id
    const name = args.shift().toLowerCase()
    try {
      const command = await this.find(appId, name)
      log.info(command)
      return command
    } catch (e) {
      log.fatal(e)
      message.reply(e.message)
      return null
    }
  }

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
              if (json.length) {
                json.forEach(command => {
                  const text = [
                    `  \`${command.name}\` :`,
                    `    **id** : ${command.id}`,
                    `    **description** : ${command.description}`
                  ].join('\n')
                  content.push(text)
                })
              } else {
                content.push('Nothing here.')
              }
              message.reply(content)
            })
            .catch(err => {
              log.fatal('ERROR', err)
            })
        } // case 'list'

        case 'list-guild': {
          const guild = message.channel.guild
          try {
            const list = await api.get(`/applications/${appId}/guilds/${guild.id}/commands`)
              .then(json => {
                const content = []
                content.push('**guild slash command list**')
                if (json.length) {
                  json.forEach(command => {
                    const text = [
                      `  \`${command.name}\` :`,
                      `    **id** : ${command.id}`,
                      `    **description** : ${command.description}`
                    ].join('\n')
                    content.push(text)
                  })
                } else {
                  content.push('Nothing here.')
                }
                message.reply(content)
              })
              .catch(err => {
                throw new Error(err)
              })
            console.log(list)
          } catch (e) {
            log.fatal(e)
            return e.message
          }
          return
        }

        case 'detail': {
          const command = await this.requireRegistered(message, args)
          if (!command) return

          return await api.get(`/applications/${appId}/commands/${command.id}`)
            .then(async json => {
              log.info(json)
              const jsonString = JSON.stringify(json)
              // sender.send(b.channel, 'see console')
              const content = [
                `**name** : ${json.name}`,
                `**description** : ${json.description}`,
                `**json** : ${jsonString}`
              ]

              await api.get(
                `/applications/${appId}/guilds/${message.channel.guild.id}/commands/${command.id}/permissions`
              )
                .then(json => {
                  log.info(json)
                  const jsonString = JSON.stringify(json)
                  message.reply('get guild permission')
                  content.push(`**permission** : ${jsonString}`)
                })
                .catch(e => {
                  log.fatal('guild permission error', e)
                })

              message.reply(content)
            })
            .catch(e => {
              log.fatal('api error : ', e)
              return e
            })
        } // case 'detail'

        case 'stored': {
          if (args.length < 1) {
            message.reply('**available** : ' + defs.map(def => def.param.name).join(', '))
            return
          }
          const name = args.shift().toLowerCase()
          let def
          try {
            def = this.load(name)
          } catch (e) {
            log.fatal(e)
            message.reply(e.message)
            return
          }
          log.info(def)
          const jsonString = JSON.stringify(def)
          const content = [
            `**name** : ${def.param.name}`,
            `**description** : ${def.param.description}`,
            `**json** : ${jsonString}`
          ]
          message.reply(content)
          return
        }

        case 'add': {
          if (args.length < 1) {
            message.reply('input command name')
            return
          }
          const name = args.shift().toLowerCase()
          let def
          try {
            def = this.load(name)
          } catch (e) {
            log.fatal(e)
            message.reply(e.message)
            return
          }
          log.info(def.permissions)

          return await api.post(`/applications/${appId}/commands`, def.param)
            .then(async result => {
              log.info(result)
              message.reply('register success')

              if (def.permissions.length) {
                const commandId = result.id

                for (const item of def.permissions) {
                  log.info(item)
                  log.info('========================================')

                  const guild = message.client.guilds.cache.find(guild => guild.name === item.guild)

                  const json = {
                    permissions: []
                  }
                  item.allow.forEach(permission => {
                    let target
                    switch (permission.type) {
                      case PermissionType.ROLE: {
                        const role = guild.roles.cache.find(role => role.name === permission.target)
                        target = role.id
                        break
                      }
                      case PermissionType.USER:
                        target = permission.target
                    }
                    json.permissions.push({
                      id: target,
                      type: permission.type,
                      permission: true
                    })
                  })
                  log.fatal(json)

                  await api.put(
                    `/applications/${appId}/guilds/${guild.id}/commands/${commandId}/permissions`,
                    json
                  )
                    .then(result => {
                      log.info(result)
                      message.reply('register permission success')
                    })
                    .catch(e => {
                      log.fatal('ERROR', e)
                    })
                }
              }
            })
            .catch(e => {
              log.fatal('ERROR', e)
              return e
            })
        }

        case 'delete': {
          const command = await this.requireRegistered(message, args)
          if (!command) return

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

    message.reply(this.help())
  } // execute()
}

module.exports = new Slash()
