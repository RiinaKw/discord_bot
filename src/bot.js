'use strict'

const fs = require('fs')
const process = require('./lib/process')
const log = require('./lib/log4js')

let behavior

module.exports = b => {
  behavior = b
}

// discord object
// module name is 'discord.js', not working in 'discord'
const Discord = require('discord.js')
const client = new Discord.Client()

try {
  const token = require('../config/token')
  client.login(token)

  client.commands = new Discord.Collection()
  const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
  commandFiles.forEach(file => {
    const command = require(`./commands/${file}`)
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command)
  })
} catch (err) {
  client.destroy()
  process.shutdown(err)
}

client.on('ready', () => {
  behavior.init(client)
  log.debug(`bot id: ${client.user.id}`)
  log.debug('Ready...')

  client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase()
    const args = interaction.data.options
    console.log(interaction.data)

    try {
      switch (command) {
        case 'blep': {
          const animal = args.find(item => item.name === 'animal').value
          client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
              type: 4,
              data: {
                content: 'Hello World! ' + animal
              }
            }
          })
          break
        }

        case 'bot': {
          const subcommand = args.find(item => item.name === 'subcommand')
          console.log(subcommand)
          client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
              type: 4,
              data: {
                content: 'this is a bot ' + subcommand
              }
            }
          })
          break
        }

        case 'bot-interval':
          client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
              type: 4,
              data: {
                content: 'interval setting'
              }
            }
          })
          break
      } // switch
    } catch (e) {
      log.fatal(e)
    }
  })
}) // ready

client.on('message', message => {
  if (!message.author.bot) {
    const isMentionToSelf = message.mentions.users.find(ch => ch.id === client.user.id)
    if (isMentionToSelf) {
      if (!behavior.command(message)) {
        behavior.mention(message)
      }
    } else {
      behavior.message(message)
    }
  }
}) // message
