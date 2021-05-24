'use strict'

function SlashBase () {
}
SlashBase.prototype = {
  unknown (command) {
    throw new Error(`unknwon command \`/${this.name} ${command}\``)
  }
}

module.exports = SlashBase
