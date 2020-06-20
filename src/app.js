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

  channelName() {
    return 'bot_test';
  }

  message(message) {
    let content = message.content;
    let channel = message.channel;
    let author = message.author.username;
    sender.send(message, content);
  }

  mention(message) {
    let content = 'Hi, there.';
    sender.send(message, content);
  }
}

require('./bot')(new Behavior);
