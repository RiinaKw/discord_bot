'use strict'

module.exports = {
  execute (client, interaction, args) {
    const animal = args.find(item => item.name === 'animal').value
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: 'Hello World! ' + animal
        }
      }
    })
  }
}
