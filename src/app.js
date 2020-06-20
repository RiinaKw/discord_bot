'use strict';

let moment = require('moment');
let sender = require('./message');

const reminder = require('../model/reminder');

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
    sender.send(channel, content);

    reminder.selectExpired()
    .then(rows => {
      for (let row of rows) {
        console.log(row);
        let time = moment(row.deadline).format('YYYY-MM-DD HH:mm:ss');
        sender.send(channel, `reminder : ${row.name}, deadline is ${time}`, {
          reply: row.user_id
        });
      }
    });
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
