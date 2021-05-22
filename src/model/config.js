'use strict'

let connection
require('../lib/database')
  .then(conn => {
    connection = conn
  })

module.exports = class Config {
  static select (name) {
    const query = connection.query(
      'SELECT * FROM configs WHERE name = ?;',
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
      'UPDATE configs SET value = ? WHERE name = ?;',
      [value, name]
    )
  }
} // class Reminder
