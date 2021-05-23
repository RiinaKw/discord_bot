'use strict'

const fs = require('fs')
const processmanager = require('./lib/process')
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
  const dir = `${__dirname}/commands`
  const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'))
  commandFiles.forEach(file => {
    const command = require(`${dir}/${file}`)
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command)
  })
} catch (err) {
  client.destroy()
  processmanager.shutdown(err)
}

client.on('ready', () => {
  behavior.init(client)
  log.debug(`bot id: ${client.user.id}`)
  log.debug('Ready...')

  client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase()
    const args = interaction.data.options
    const user = interaction.member.user
    const username = `${user.username}#${user.discriminator}`
    log.debug(`${username} used slash command ${command}`)
    log.debug(`${command} : `, args)

    try {
      let slash
      try {
        slash = require('./slashes/' + command)
      } catch (e) {
        throw new Error(`unknown slash command : ${command}`)
      }
      slash.execute(client, interaction, args)
    } catch (e) {
      log.fatal(e)
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: e.message
          }
        }
      })
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
