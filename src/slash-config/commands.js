'use strict'

// ここ読め : https://discord.com/developers/docs/interactions/slash-commands
// option の値は : https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
// bot の権限 : https://qiita.com/CyberRex/items/2ce560f88427f4764425

const OptionType = require('./options')
const PermissionType = require('./permissions')

const defs = []

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
        name: 'user',
        description: 'Show user detail [[use embed]]',
        type: OptionType.SUB_COMMAND,
        options: [
          {
            name: 'user',
            description: 'user',
            type: OptionType.USER,
            required: true
          }
        ]
      }
    ]
  },
  permissions: [
    {
      guild: 'Riina\'s test server',
      allow: [
        {
          type: PermissionType.ROLE,
          target: 'admin'
        },
        {
          type: PermissionType.ROLE,
          target: '広報'
        }
      ]
    },
    {
      guild: 'からもち部屋',
      allow: [
        {
          type: PermissionType.USER,
          target: '320142596833935360' // リイナ#1646
        }
      ]
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
        name: 'author',
        description: 'Show author info of this bot',
        type: OptionType.SUB_COMMAND,
        options: [
          {
            name: 'type',
            description: 'info type',
            type: OptionType.STRING,
            required: true,
            choices: [
              {
                name: 'Twitter',
                value: 'https://twitter.com/RiinaKw'
              },
              {
                name: 'Github',
                value: 'https://github.com/RiinaKw/discord_bot'
              }
            ]
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
                name: 'Streaming',
                value: 'STREAMING'
              },
              {
                name: 'Listening',
                value: 'LISTENING'
              },
              {
                name: 'Watching',
                value: 'WATCHING'
              },
              {
                name: 'Custom',
                value: 'CUSTOM'
              },
              {
                name: 'Competing',
                value: 'COMPETING'
              }
            ]
          }
        ]
      } // activity
    ] // options
  },
  permissions: true
})

module.exports = defs
