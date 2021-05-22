'use strict'

let connection
require('../lib/database')
  .then(conn => {
    connection = conn
  })

const Base = require('./base')

module.exports = class Config extends Base {
  static get TABLE () {
    return 'configs'
  }

  static select (name) {
    const query = connection.query(
      `SELECT * FROM ${this.TABLE} WHERE name = ?;`,
      [name]
    )
      .then(rows => {
        if (!rows.length) {
          throw new Error(`unknown name : ${name}`)
        }
        return rows[0]
      })
    return query
  }

  static update (name, value) {
    return connection.query(
      `UPDATE ${this.TABLE} SET value = ? WHERE name = ?;`,
      [value, name]
    )
  }
} // class Reminder
