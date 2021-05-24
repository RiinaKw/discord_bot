'use strict'

const OptionType = require('./options')
const PermissionType = require('./permissions')

const defs = []
defs.push({
  param: {
    name: 'aaaaa',
    description: 'Command of aaaaa'
  },
  permissions: true
})
defs.push({
  param: {
    name: 'bbbbb',
    description: 'Command of bbbbb'
  },
  permissions: true
})
defs.push({
  param: {
    name: 'admin',
    description: 'Execute a admin command',
    default_permission: false,
    options: [
      {
        name: 'reboot',
        description: 'Reboot this bot',
        type: OptionType.SUB_COMMAND
      },
      {
        name: 'more',
        description: 'more command',
        type: OptionType.SUB_COMMAND
      },
      {
        name: 'another',
        description: 'another command',
        type: OptionType.SUB_COMMAND
      }
    ]
  },
  permissions: [
    {
      target: {
        guild: 'Riina\'s test server',
        role: 'admin'
      },
      type: PermissionType.ROLE,
      permission: true
    }
  ]
})
defs.push({
  param: {
    name: 'bot',
    description: 'Execute a bot command',
    options: [
      {
        name: 'interval',
        description: 'Manage bot interval',
        type: OptionType.SUB_COMMAND,
        options: [
          {
            name: 'minutes',
            description: 'interval value',
            type: OptionType.INTEGER,
            required: false
          }
        ]
      },
      {
        name: 'activity',
        description: 'Change bot activity',
        type: OptionType.SUB_COMMAND,
        options: [
          {
            name: 'name',
            description: 'activity name',
            type: OptionType.STRING,
            required: false
          },
          {
            name: 'type',
            description: 'activity type',
            type: OptionType.STRING,
            required: false,
            choices: [
              {
                name: 'Playing',
                value: 'PLAYING'
              },
              {
                name: 'Another',
                value: 'ANOTHER'
              }
            ]
          }
        ]
      }
    ] // options
  },
  permissions: true
})

module.exports = defs
