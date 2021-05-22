'use strict'

module.exports = {
  name: 'ping',
  description: 'Ping!',
  execute (message, args) {
    console.log(message)
    message.channel.send('Pong.')
  }
}
