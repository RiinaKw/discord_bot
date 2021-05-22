'use strict';

const moment = require('moment');
const sender = require('./message');
const log = require('./lib/log4js');;

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
    return app.channelName();
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
  command (args) {
    const subcommand = args.shift().toLowerCase()
    if (subcommand === 'interval') {
      if (args.length) {
        const amount = parseInt(args.shift())
        if (!isNaN(amount)) {
          // change interval time
          this.intervalPerMinutes = amount
          this.interval(true)
          sender.send(
            this.channel,
            `bot mode : set interval to ${this.intervalPerMinutes} minutes`
          )
          log.info(`bot interval changed : ${this.intervalPerMinutes} minutes`)
          return
        }
      }
      // show current interval
      const next = this.nextInterval()
      sender.send(
        this.channel,
        'bot mode :\n' +
        `  current interval is ${this.intervalPerMinutes} minutes\n` +
        `  next interval is ${next}`
      )
    } else {
      this.help()
    }
  } // function command()

  help() {
    let content = `bot command\n`
      + `bot interval : Display automatic notification interval as minutes.\n`
      + `bot interval (5|10|15|20|30|60) : Change the automatic notification intercal, specify the minutes.`
      + `bot interval next : Show next time for the automatic notification.`;
    sender.send(this.channel, content);
  } // function help()

  message (message) {
    app.message(message)
  } // function message()

  mention (message) {
    const content = message.content
    const match = content.match(/^<@!?\d+>\s+(?<body>.*)$/)
    const body = match.groups.body

    const args = body.split(/\s+/)
    const command = args.shift().toLowerCase()

    if (command === 'bot') {
      /*
      if (match = body.match(/^bot\s+?(?<command>.*?)$/)) {
        let command = match.groups.command;
        this.command(command);
        console.log(`command : ${command}`);
      } else {
        this.help();
      }
      */
      if (args.length) {
        log.info('command : ', args)
        this.command(args)
      } else {
        this.help()
      }
    } else {
      if (! app.reply(message, body)) {
        app.replyDefault(message, body)
      }
    }
  } // function mention()
} // class Behavior

require('./bot')(new Behavior);
