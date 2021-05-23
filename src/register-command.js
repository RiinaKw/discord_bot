'use strict'

console.log('ここ読め : https://discord.com/developers/docs/interactions/slash-commands')
console.log('option の値は : https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype')

const defs = []

/*
defs.push(
  {
    name: 'blep',
    description: 'Send a random adorable animal photo',
    options: [
      {
        name: 'animal',
        description: 'The type of animal',
        type: 3,
        required: true,
        choices: [
          {
            name: 'Dog',
            value: 'animal_dog'
          },
          {
            name: 'Cat',
            value: 'animal_cat'
          },
          {
            name: 'Penguin',
            value: 'animal_penguin'
          }
        ]
      },
      {
        name: 'only_smol',
        description: 'Whether to show only baby animals',
        type: 5,
        required: false
      }
    ]
  }
)
*/

defs.push(
  {
    name: 'bot',
    description: 'Execute a bot command',
    options: [
      {
        name: 'interval',
        description: 'Manage bot interval',
        type: 1,
        options: [
          {
            name: 'minutes',
            description: 'interval value',
            type: 4,
            required: false
          }
        ]
      },
      {
        name: 'help',
        description: 'Show help of bot command',
        type: 1
      }
    ]
  }
)

defs.push(
  {
    name: 'admin',
    description: 'Execute a admin command',
    //permission: 2048,
    options: [
      {
        name: 'reboot',
        description: 'Reboot this bot',
        type: 1
      },
      {
        name: 'more',
        description: 'more command',
        type: 1
      }
    ]
  }
)

defs.push(
  {
    name: 'slash',
    description: 'Manage slash commands',
    options: [
      {
        name: 'list',
        description: 'Show all slash commands',
        type: 1
      },
      {
        name: 'detail',
        description: 'Show detail of slash command',
        type: 1,
        options: [
          {
            name: 'name',
            description: 'command name',
            type: 3,
            required: true
          }
        ]
      },
      {
        name: 'delete',
        description: 'delete slash command',
        type: 1,
        options: [
          {
            name: 'name',
            description: 'command name',
            type: 3,
            required: true
          }
        ]
      }
    ]
  }
)

/*
defs.push(
  {
    name: 'not-implemented',
    description: 'Example of not-implemented slash command'
  }
)
*/

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

client.on('ready', () => {
  const appId = client.user.id
  const api = require('./lib/api')

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
              id: 32,
              type: 1,
              permission: true
            }
          ]
        }
        api.put(`/applications/${appId}/commands/${commandId}/permissions`, json)
          .then(result => {
            log.info(result)
          })
          .catch(e => {
            log.fatal('ERROR', e)
          })
          */
      })
      .catch(e => {
        log.fatal('ERROR', e)
      })
  })
  client.destroy()
})
