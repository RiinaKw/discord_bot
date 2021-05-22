'use strict'

const log = require('../lib/log4js')
const config = require('../model/config')

module.exports = {
  execute (client, interaction, args) {
    const subcommand = args.find(item => item.name === 'subcommand')
    switch (subcommand.options[0].name) {
      case 'interval': {
        const b = client.behavior
        const interval = subcommand.options.find(item => item.name === 'interval')
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
      case 'dummy':
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: {
              content: 'dummy command ' + subcommand
            }
          }
        })
        break
    }
  }
}
