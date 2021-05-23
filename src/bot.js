'use strict'

const log = require('./lib/log4js')
const processmanager = require('./lib/process')

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
        throw new Error(`unknown slash command : \`${command}\``)
      }
      let content = await slash.execute(client, args)
      if (typeof content !== 'string') {
        content = content.join('\n')
      }
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: content
          }
        }
      })
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
  if (message.author.bot) return

  const isMentionToSelf = message.mentions.users.find(ch => ch.id === client.user.id)
  if (isMentionToSelf) {
    behavior.mention(message)
  } else {
    behavior.message(message)
  }
}) // message
