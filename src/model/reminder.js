'use strict'

let connection
require('../lib/database')
  .then(conn => {
    connection = conn
  })

const Base = require('./base')

module.exports = class Reminder extends Base {
  static get TABLE () {
    return 'reminders'
  }

  static selectExpired (userId) {
    if (userId === undefined) {
      return connection.query(`SELECT * FROM ${this.TABLE} WHERE deadline <= NOW();`)
    } else {
      return connection.query(
        `SELECT * FROM ${this.TABLE} WHERE user_id = ? AND deadline <= NOW();`,
        [userId]
      )
    }
  } // function selectExpired()

  static selectAll (userId) {
    return connection.query(
      `SELECT * FROM ${this.TABLE} WHERE user_id = ?;`,
      [userId]
    )
  }

  static insert (userId, name, deadline) {
    return connection.query(
      `INSERT INTO ${this.TABLE}(user_id, name, deadline) VALUES(?, ?, ?);`,
      [userId, name, deadline]
    )
  } // function insert()

  static delete (userId, name) {
    return connection.query(
      `DELETE FROM ${this.TABLE} WHERE user_id = ? AND name = ?;`,
      [userId, name]
    )
  } // function delete()
} // class Reminder
