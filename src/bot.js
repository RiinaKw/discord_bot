'use strict'

let behavior

module.exports = b => {
  behavior = b
}

// discord object
// module name is 'discord.js', not working in 'discord'
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  const channelName = behavior.channelName()
  const channel = client.channels.cache.find(ch => ch.name === channelName)
  behavior.init(client.user, channel)
  console.log(`bot id: ${client.user.id}`)
  console.log('Ready...')
}) // ready

client.on('message', message => {
  if (!message.author.bot) {
    const isMentionToSelf = message.mentions.users.find(ch => ch.id === client.user.id)
    if (isMentionToSelf) {
      behavior.mention(message)
    } else {
      behavior.message(message)
    }
  }
}) // message

const token = require('../config/token')
client.login(token)
