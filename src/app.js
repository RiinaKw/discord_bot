'use strict';

let moment = require('moment');
let sender = require('./message');

class App {
  init(user, channel) {
    sender.send(channel, 'Ready go.');
    user.setPresence({ activity: { name: 'discord.js ', type: 'PLAYING' } });
  } // function init()

  defaultIntervalMinutes() {
    return 2;
  } // function defaultIntervalMinutes()

  interval(channel) {
    let content = moment().format('YYYY-MM-DD HH:mm:ss');
    sender.send(this.channel, content);
  } // function interval()

  message(message) {
    // process here if you wanna reply to the message
    /*
    let content = message.content;
    let channel = message.channel;
    let author = message.author.username;
    sender.reply(message, content);
    */
  } // function message()

  reply(message, body) {
    // reply for message
    let content = 'Hi, there.';
    sender.reply(message, content);
  } // function reply()
} // class App

require('./behavior')(new App);
