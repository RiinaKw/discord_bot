'use strict'

const log = require('../lib/log4js')
const config = require('../model/config')

module.exports = {
  execute (client, interaction, args) {
    const command = args.find(item => item.name === 'command')
    const subcommand = command.options[0].name
    switch (subcommand) {
      case 'interval': {
        const b = client.behavior
        const interval = command.options.find(item => item.name === 'interval')
        log.fatal('interval', interval)
        if (interval.options) {
          const minutes = interval.options.find(item => item.name === 'minutes')

          // change interval time
          b.intervalPerMinutes = minutes.value
          b.interval(true)
          config.update('interval', minutes.value)

          client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
              type: 4,
              data: {
                content: `bot mode : set interval to ${minutes.value} minutes`
              }
            }
          })
          log.info(`bot interval changed : ${minutes.value} minutes`)
        } else {
          // show current interval
          const next = b.nextInterval()
          const content = [
            '**bot interval** :',
            `  current interval is \`${b.intervalPerMinutes} minutes\``,
            `  next interval is \`${next}\``
          ]
          client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
              type: 4,
              data: {
                content: content.join('\n')
              }
            }
          })
        }
        break
      }
      default:
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: {
              content: 'try to execute ' + subcommand
            }
          }
        })
        break
    }
  }
}
