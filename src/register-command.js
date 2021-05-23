'use strict'

console.log('ここ読め : https://discord.com/developers/docs/interactions/slash-commands')

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
        name: 'subcommand',
        description: 'sub command',
        type: 3,
        required: true,
        choices: [
          {
            name: 'interval',
            value: 'sub_interval',
            description: 'Execute bot interval',
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
            name: 'dummy',
            value: 'sub_dummy',
            description: 'Dummy subcommand',
            type: 1
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
    api.post(`/applications/${appId}/commands`, def)
      .then(result => {
        console.log('-------------------------')
        log.info(result)
      })
      .catch(err => {
        log.fatal('ERROR', err)
      })
  })
  client.destroy()
})
