'use strict'

function CommandBase () {
}
CommandBase.prototype = {
  help () {
    let usage = this.usage
    if (typeof usage !== 'string') usage = usage.join('\n')
    return `**${this.name} commands** \n${usage}`
  }
}

module.exports = CommandBase
