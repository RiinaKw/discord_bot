'use strict';

let moment = require('moment');
let sender = require('./message');

class Behavior {
  init(user, channel) {
    sender.send(channel, 'Ready go.');

    this.channel = channel;
    this.timeoutId;
    this.intervalPerMinutes = 2;
    this.intervalNextMinutes = 0;
    this.intervalNextSeconds = 0;
    this.prevIntervalTime;
    this.interval(true);
  }

  channelName() {
    return 'bot_test';
  }

  interval(boot) {
    if (! boot) {
      let content = moment().format('YYYY-MM-DD HH:mm:ss');
      sender.send(this.channel, content);
    }

    let time = moment();
    this.prevIntervalTime = time;
    this.intervalNextMinutes = this.intervalPerMinutes - parseInt( time.minutes() % this.intervalPerMinutes );
    if ( this.intervalNextMinutes <= 0 ) {
      this.intervalNextMinutes = this.intervalPerMinutes;
    }
    this.intervalNextSeconds = (this.intervalNextMinutes * 60 - time.seconds());
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => { this.interval(false) }, this.intervalNextSeconds * 1000);
  }

  nextInterval() {
    let next = this.prevIntervalTime.add(this.intervalNextSeconds, 'seconds');
    return next.format('YYYY-MM-DD HH:mm:ss');
  } // function nextInterval()

  // bot command
  command(command) {
    let match;
    if (match = command.match(/^interval(\s|$)/)) {

      // interval command
      if (match = command.match(/^interval\s+next/)) {
        // show next interval time
        let next = this.nextInterval();
        this.channel.send(`bot mode : next interval is ${next}`);
      } else if (match = command.match(/^interval\s+(?<interval>\d+)/)) {
        // change interval time
        let intervalMinutes = match.groups.interval;
        this.intervalPerMinutes = parseInt(intervalMinutes);
        this.interval(true);
        sender.send(this.channel, `bot mode : set interval to ${this.intervalPerMinutes} minutes`);
        console.log(`bot interval changed : ${this.intervalPerMinutes} minutes`);
      } else {
        // show current interval
        sender.send(this.channel, `bot mode : current interval is ${this.intervalPerMinutes} minutes`);
      }

    } else {
      this.help()
    }
  } // command()

  help() {
    let content = `bot command\n`
      + `bot interval : Display notification interval for current time.\n`
      + `bot interval (5|10|15|20|30|60) : Change the notification for the current time, specify the desired minutes.`
      + `bot interval next : Show next time for the notification.`;
    sender.send(this.channel, content);
  } // function help()

  message(message) {
    let content = message.content;
    let channel = message.channel;
    let author = message.author.username;
    sender.reply(message, content);
  }

  mention(message) {
    let content = message.content;
    let match = content.match(/^<@!?\d+>\s+(?<body>.*)$/);
    let body = match.groups.body;

    if (body.match(/^bot(\s|$)/)) {
      if (match = body.match(/^bot\s+?(?<command>.*?)$/)) {
        let command = match.groups.command;
        this.command(command);
        console.log(`command : ${command}`);
      } else {
        this.help();
      }
    } else {
      let content = 'Hi, there.';
      sender.reply(message, content);
    }
  }
}

require('./bot')(new Behavior);
