'use strict';

let connection;

require('../model/database')
.then(conn => {
  connection = conn;
  console.log('connect to mariadb');
})
.catch(err => {
  throw err;
});

module.exports = class Reminder {
  static selectExpired(user_id) {
    if (user_id === undefined) {
      return connection.query(`SELECT * FROM reminders WHERE deadline <= NOW();`);
    } else {
      return connection.query(
        `SELECT * FROM reminders WHERE user_id = ? AND deadline <= NOW();`,
        [ user_id ]
      );
    }
  } // function selectExpired()

  static selectAll(user_id) {
    return connection.query(
      `SELECT * FROM reminders WHERE user_id = ?;`,
      [ user_id ]
    );
  }

  static insert(user_id, name, deadline) {
    return connection.query(
      `INSERT INTO reminders(user_id, name, deadline) VALUES(?, ?, ?);`,
      [ user_id, name, deadline ]
    );
  } // function insert()

  static delete(user_id, name) {
    return connection.query(
      `DELETE FROM reminders WHERE user_id = ? AND name = ?;`,
      [ user_id, name ]
    );
  } // function delete()
}; // class Reminder
