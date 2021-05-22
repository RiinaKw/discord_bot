'use strict';

const moment = require('moment');
const sender = require('./message');

const config = require('../config/global');
const reminder = require('../model/reminder');

class App {
  init(user, channel) {
    sender.send(channel, 'Ready go.');
    if (config.activity) {
      user.setPresence({activity: config.activity});
    }
  } // function init()

  channelName() {
    return config.channel || 'general';
  } // function channelName()

  defaultIntervalMinutes() {
    return config.interval || 60;
  } // function defaultIntervalMinutes()

  interval(channel) {
    let content = moment().format('YYYY-MM-DD HH:mm:ss');
    sender.send(channel, content);

    reminder.selectExpired()
    .then(rows => {
      for (let row of rows) {
        console.log(row);
        let deadline = moment(row.deadline).format('YYYY-MM-DD HH:mm:ss');
        sender.send(channel, `reminder : ${row.name}, deadline is ${deadline}`, {
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
    let match;
    if (match = body.match(/^reminder expired(\s|$)/)) {
      reminder.selectExpired(message.author.id)
      .then(rows => {
        if (rows.length > 0) {
          for (let row of rows) {
            console.log(row);
            let deadline = moment(row.deadline).format('YYYY-MM-DD HH:mm:ss');
            sender.reply(message, `${row.name}, deadline is ${deadline}`);
          }
        } else {
          sender.reply(message, `no reminder expired`);
        }
      });
      return true;
    } else if (match = body.match(/^reminder all(\s|$)/)) {
      reminder.selectAll(message.author.id)
      .then(rows => {
        if (rows.length > 0) {
          for (let row of rows) {
            console.log(row);
            let deadline = moment(row.deadline).format('YYYY-MM-DD HH:mm:ss');
            sender.reply(message, `${row.name}, deadline is ${deadline}`);
          }
        } else {
          sender.reply(message, `no reminder`);
        }
      });
      return true;
    } else if (match = body.match(/^register reminder\s+(?<name>.+?)\s+(?<deadline>.+?)$/)) {
      let name = match.groups.name
      let deadline = moment(match.groups.deadline).format('YYYY-MM-DD HH:mm:ss');

      reminder.insert(message.author.id, name, deadline)
      .then(rows => {
        console.log(rows);
        sender.reply(message, `accepted.`);
      })
      .catch(err => {
        sender.reply(message, `[error] fail to accept.`);
      });
      return true;
    } else if (match = body.match(/^delete reminder\s+(?<name>.+?)$/)) {
      let name = match.groups.name;
      reminder.delete(message.author.id, name)
      .then(rows => {
        console.log(rows);
        sender.reply(message, `accepted.`);
      })
      .catch(err => {
        sender.reply(message, `[error] fail to accept.`);
      });
      return true;
    } else if (match = body.match(/reboot/)) {
        sender.reply(message, `reboot`);
        boo();
        return true;
    }
  } // function reply()

  replyDefault(message, body) {
    // reply for message
    let content = 'Hi, there.';
    sender.reply(message, content);
  } // function replyDefault()
} // class App

const app = new App;
require('./behavior')(app);

module.exports = app;
