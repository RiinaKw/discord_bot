'use strict';

let moment = require('moment');

class Behavior {
  init(user, channel) {
    channel.send('Ready go.');

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
      let msg = moment().format('YYYY-MM-DD HH:mm:ss');
      this.channel.send(msg)
      .then(message => console.log(`Sent message: ${msg}`))
      .catch(console.error);
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
