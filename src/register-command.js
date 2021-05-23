'use strict'

console.log('ここ読め : https://discord.com/developers/docs/interactions/slash-commands')
console.log('option の値は : https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype')

const processmanager = require('./lib/process')
const log = require('./lib/log4js')

const Discord = require('discord.js')
const client = new Discord.Client()

try {
  const token = require('../config/token')
  client.login(token)
} catch (e) {
  client.destroy()
  processmanager.shutdown(e)
}

class OptionType {
  static get SUB_COMMAND () {
    return 1
  }

  static get SUB_COMMAND_GROUP () {
    return 2
  }

  static get STRING () {
    return 3
  }

  static get INTEGER () {
    return 4
  }

  static get BOOLEAN () {
    return 5
  }

  static get USER () {
    return 6
  }

  static get CHANNEL () {
    return 7
  }

  static get ROLE () {
    return 8
  }
}

class PermissionType {
  static get ROLE () {
    return 1
  }

  static get USER () {
    return 2
  }
}

const defs = []

defs.push(
  {
    name: 'bot',
    description: 'Execute a bot command',
    options: [
      {
        name: 'interval',
        description: 'Manage bot interval',
        type: OptionType.SUB_COMMAND,
        options: [
          {
            name: 'minutes',
            description: 'interval value',
            type: OptionType.INTEGER,
            required: false
          }
        ]
      },
      {
        name: 'activity',
        description: 'Change bot activity',
        type: OptionType.SUB_COMMAND,
        options: [
          {
            name: 'name',
            description: 'activity name',
            type: OptionType.STRING,
            required: false
          },
          {
            name: 'type',
            description: 'activity type',
            type: OptionType.STRING,
            required: false,
            choices: [
              {
                name: 'Playing',
                value: 'PLAYING'
              },
              {
                name: 'Another',
                value: 'ANOTHER'
              }
            ]
          }
        ]
      }
    ] // options
  }
)

defs.push(
  {
    name: 'admin',
    description: 'Execute a admin command',
    // default_permission: false,
    options: [
      {
        name: 'reboot',
        description: 'Reboot this bot',
        type: OptionType.SUB_COMMAND
      },
      {
        name: 'more',
        description: 'more command',
        type: OptionType.SUB_COMMAND
      },
      {
        name: 'another',
        description: 'another command',
        type: OptionType.SUB_COMMAND
      }
    ]
  }
)

defs.push(
  {
    name: 'not-implemented',
    description: 'Example of not-implemented slash command'
  }
)

defs.push(
  {
    name: 'aaa',
    description: 'Command of aaa'
  }
)

client.on('ready', async () => {
  const appId = client.user.id
  const api = require('./lib/api')

  /*
  const guild = client.guilds.cache.find(item => item.name === 'Riina\'s test server')
  const roleAdmin = guild.roles.cache.find(item => item.name === 'admin')
  // console.log(roleEveryone)
  */

  const roles = []
  client.guilds.cache.each(guild => {
    const roleEveryone = guild.roles.cache.find(item => item.name === '@everyone')
    roles.push(roleEveryone)
  })

  defs.forEach(def => {
    log.info(def)
    api.post(`/applications/${appId}/commands`, def)
      .then(result => {
        console.log('-------------------------')
        log.info(result)

        /*
        const commandId = result.id
        const json = {
          permissions: [
            {
              id: roleAdmin.id,
              type: PermissionType.ROLE,
              permission: true
            }
          ]
        }
        api.put(`/applications/${appId}/guilds/${guild.id}/commands/${commandId}/permissions`, json)
          .then(result => {
            log.info(result)
          })
          .catch(e => {
            log.fatal('ERROR', e)
          })
          */

        /*
        const commandId = result.id
        roles.forEach(role => {
          console.log(role)
          const json = {
            permissions: [
              {
                id: role.id,
                type: PermissionType.ROLE,
                permission: true
              }
            ]
          }
          api.put(`/applications/${appId}/guilds/${role.guild.id}/commands/${commandId}/permissions`, json)
            .then(result => {
              log.info(result)
            })
            .catch(e => {
              log.fatal('ERROR', e)
            })
        })
        */

      })
      .catch(e => {
        log.fatal('ERROR', e)
      })
  })
  client.destroy()
})
