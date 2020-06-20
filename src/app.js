'use strict';

class Behavior {
  init(user, channel) {
    channel.send('Ready go.');
  }

  channelName() {
    return 'bot_test';
  }

  message(message) {
    let msg = message.content;
    let channel = message.channel;
    let author = message.author.username;
    message.reply(msg)
    .then(message => console.log(`Sent message: ${msg}`))
    .catch(console.error);
  }

  mention(message) {
    let msg = 'Hi, there.';
    message.reply(msg)
    .then(message => console.log(`Sent message: ${msg}`))
    .catch(console.error);
  }
}

require('./bot')(new Behavior);
