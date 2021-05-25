'use strict'

const log = require('../lib/log4js')

class BotSlash extends require('../base/slash') {
  constructor () {
    super()

    this.name = 'bot'
  }

  execute (client, args) {
    const subcommand = args[0]
    switch (subcommand.name) {
      case 'interval': {
        const b = client.behavior
        if (subcommand.options) {
          const minutes = subcommand.options.find(item => item.name === 'minutes').value
          if (minutes <= 0) {
            throw new Error('**bot interval error** : minutes must be greater than zero')
          }

          // change interval time
          b.intervalPerMinutes = client.app.config.set('interval', minutes)
          b.interval(true)

          log.info(`bot interval changed : ${minutes} minutes`)
          return `**bot interval** : set to ${minutes} minutes`
        } else {
          // show current interval
          const next = b.nextInterval()
          return [
            '**bot interval** :',
            `  current interval is \`${b.intervalPerMinutes} minutes\``,
            `  next interval is \`${next}\``
          ]
        }
      }

      case 'author':
        return subcommand.options.find(item => item.name === 'type').value

      case 'activity': {
        if (subcommand.options) {
          const activityName = subcommand.options.find(item => item.name === 'name')
          const activityType = subcommand.options.find(item => item.name === 'type')
          if (activityName && activityType) {
            const json = {
              name: activityName.value,
              type: activityType.value
            }
            client.app.config.set('activity', json)
            client.user.setPresence({ activity: json })
            return [
              '**bot activity** :',
              `  ${json.type} ${json.name}`
            ]
          }
          return 'invalid args'
        } else {
          // show current
          const json = client.app.config.get('activity')
          return [
            '**bot activity** :',
            `  ${json.type} ${json.name}`
          ]
        }
      }

      default:
        this.unknown(subcommand.name)
    }
  }
}

module.exports = new BotSlash()
