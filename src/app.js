'use strict';

// discord object
// module name is 'discord.js', not working in 'discord'
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  let channel_name = 'bot_test';
  let channel = client.channels.cache.find(ch => ch.name === channel_name);
  channel.send('Ready go.');
  console.log(`bot id: ${client.user.id}`);
  console.log(`Ready...`);
});

client.on('message', message => {
  if (message.author.bot) {
    return;
  } else {
    let msg = message.content;
    let channel = message.channel;
    let author = message.author.username;
    message.reply(msg)
    .then(message => console.log(`Sent message: ${msg}`))
    .catch(console.error);
  }
});

const token = require('../config/token');
client.login(token);
