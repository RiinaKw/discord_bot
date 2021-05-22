'use strict'

console.log('ここ読め : https://discord.com/developers/docs/interactions/slash-commands')

const request = require('request')

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
/*
const json = {
  name: 'bot-interval',
  description: 'Change execution interval',
  options: [
    {
      name: 'minutes',
      description: 'Execution interval',
      type: 5,
      required: false
    }
  ]
}
*/

const url = 'https://discord.com/api/v8/applications/720987257733120080/commands'
const token = require('../config/token')

const options = {
  uri: url,
  headers: {
    'Content-type': 'application/json',
    Authorization: 'Bot ' + token
  },
  json: json
}

request.post(options, function (err, res, body) {
  if (err) {
    console.log('Error: ' + err.message)
    return
  }
  console.log(body)
})
