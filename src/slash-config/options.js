'use strict'

module.exports = class {
  static get SUB_COMMAND () {
    return 1
  }

  static get SUB_COMMAND_GROUP () {
    return 2
  }

  static get STRING () {
    return 3
  }

  static get INTEGER () {
    return 4
  }

  static get BOOLEAN () {
    return 5
  }

  static get USER () {
    return 6
  }

  static get CHANNEL () {
    return 7
  }

  static get ROLE () {
    return 8
  }
}
