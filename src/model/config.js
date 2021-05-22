'use strict'

const process = require('../lib/process')

let connection

require('./database')
  .then(conn => {
    connection = conn
    console.log('connect to mariadb')
  })
  .catch(err => {
    process.shutdown(err)
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
