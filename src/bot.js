'use strict';

let behavior;

module.exports = b => {
  behavior = b;
};

// discord object
// module name is 'discord.js', not working in 'discord'
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  let channel_name = behavior.channelName();
  let channel = client.channels.cache.find(ch => ch.name === channel_name);
  behavior.init(client.user, channel);
  console.log(`bot id: ${client.user.id}`);
  console.log(`Ready...`);
}); // ready

client.on('message', message => {
  if (message.author.bot) {
    return;
  } else {
    let isMentionToSelf = message.mentions.users.find(ch => ch.id === client.user.id);
    if (isMentionToSelf) {
      behavior.mention(message);
    } else {
      behavior.message(message);
    }
  }
}); // message

const token = require('../config/token');
client.login(token);
