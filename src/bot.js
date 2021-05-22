'use strict'

const fs = require('fs')

let behavior

module.exports = b => {
  behavior = b
}

// discord object
// module name is 'discord.js', not working in 'discord'
const Discord = require('discord.js')
const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
console.log(commandFiles)

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command)
}

client.on('ready', () => {
  const channelName = behavior.channelName()
  const channel = client.channels.cache.find(ch => ch.name === channelName)
  behavior.init(client, channel)
  console.log(`bot id: ${client.user.id}`)
  console.log('Ready...')
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

const token = require('../config/token')
client.login(token)
