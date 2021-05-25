'use strict'

class ModelBase {
  async connect () {
    if (this.connection) return
    require('../lib/database')
      .then(conn => {
        this.connection = conn
      })
  }
}

module.exports = ModelBase
