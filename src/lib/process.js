'use strict'

const log = require('./log4js')

module.exports = {
  shutdown: (err) => {
    const msecWait = 100
    if (err) {
      log.fatal(err)
      setTimeout(
        () => { process.exit(1) },
        msecWait
      )
    } else {
      setTimeout(
        () => { process.exit(0) },
        msecWait
      )
    }
  }
}
