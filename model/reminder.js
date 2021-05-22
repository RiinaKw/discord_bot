'use strict'

const log = require('../src/lib/log4js')

let connection

require('../model/database')
  .then(conn => {
    connection = conn
    console.log('connect to mariadb')
  })
  .catch(err => {
    log.fatal(err)
    setTimeout(
      () => { process.exit(1) },
      100
    )
  })

module.exports = class Reminder {
  static selectExpired (userId) {
    if (userId === undefined) {
      return connection.query('SELECT * FROM reminders WHERE deadline <= NOW();')
    } else {
      return connection.query(
        'SELECT * FROM reminders WHERE user_id = ? AND deadline <= NOW();',
        [userId]
      )
    }
  } // function selectExpired()

  static selectAll (userId) {
    return connection.query(
      'SELECT * FROM reminders WHERE user_id = ?;',
      [userId]
    )
  }

  static insert (userId, name, deadline) {
    return connection.query(
      'INSERT INTO reminders(user_id, name, deadline) VALUES(?, ?, ?);',
      [userId, name, deadline]
    )
  } // function insert()

  static delete (userId, name) {
    return connection.query(
      'DELETE FROM reminders WHERE user_id = ? AND name = ?;',
      [userId, name]
    )
  } // function delete()
} // class Reminder
