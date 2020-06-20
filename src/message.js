'use strict';

let moment = require('moment');

module.exports = {
  send: (channel, content) => {
    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    channel.send(content)
    .then(message => console.log(`${now}, sent message: ${content}`))
    .catch(console.error);
  },
  reply: (message, content) => {
    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    message.reply(content)
    .then(message => console.log(`${now}, sent message: ${content}`))
    .catch(console.error);
  }
};
