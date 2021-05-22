'use strict'

console.log('ここ読め : https://discord.com/developers/docs/interactions/slash-commands')

/*
const json = {
  name: 'blep',
  description: 'Send a random adorable animal photo',
  options: [
    {
      name: 'animal',
      description: 'The type of animal',
      type: 3,
      required: true,
      choices: [
        {
          name: 'Dog',
          value: 'animal_dog'
        },
        {
          name: 'Cat',
          value: 'animal_cat'
        },
        {
          name: 'Penguin',
          value: 'animal_penguin'
        }
      ]
    },
    {
      name: 'only_smol',
      description: 'Whether to show only baby animals',
      type: 5,
      required: false
    }
  ]
}
*/
/*
const json = {
  name: 'bot',
  description: 'Execute a bot command',
  options: [
    {
      name: 'subcommand',
      description: 'sub command',
      type: 2,
      options: [
        {
          name: 'interval',
          description: 'Execute bot interval',
          type: 1,
          options: [
            {
              name: 'minutes',
              description: 'interval value',
              type: 4,
              required: false
            }
          ]
        },
        {
          name: 'dummy',
          description: 'Dummy subcommand',
          type: 1
        }
      ]
    }
  ]
}
*/
const json = {
  name: 'not-implemented',
  description: 'Example of not-implemented slash command'
}

const api = require('./lib/api')
api.post('/applications/720987257733120080/commands', json)
  .then(result => {
    console.log(result)
  })
  .catch(err => {
    console.log('ERROR', err)
  })
