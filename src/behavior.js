'use strict';

let moment = require('moment');
let sender = require('./message');

let app;

module.exports = a => {
  app = a;
};

class Behavior {
  init(user, channel) {

    this.channel = channel;
    this.timeoutId;
    this.intervalPerMinutes = app.defaultIntervalMinutes();
    this.intervalNextMinutes;
    this.intervalNextSeconds;
    this.prevIntervalTime;
    this.interval(true);

    app.init(user, channel);
  } // function init()

  channelName() {
    return 'bot_test';
  } // function channelName()

  interval(boot) {
    if (! boot) {
      app.interval(this.channel);
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
  } // function interval()

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
  } // function command()

  help() {
    let content = `bot command\n`
      + `bot interval : Display notification interval for current time.\n`
      + `bot interval (5|10|15|20|30|60) : Change the notification for the current time, specify the desired minutes.`
      + `bot interval next : Show next time for the notification.`;
    sender.send(this.channel, content);
  } // function help()

  message(message) {
    app.message(message);
  } // function message()

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
      app.reply(message, body)
    }
  } // function mention()
} // class Behavior

require('./bot')(new Behavior);
