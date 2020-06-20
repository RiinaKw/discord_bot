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
  static selectExpired(userId) {
    if (userId === undefined) {
      return connection.query(`SELECT * FROM reminders WHERE deadline <= NOW();`);
    } else {
      return connection.query(`SELECT * FROM reminders WHERE user_id = '${userId}' AND deadline <= NOW();`);
    }
} // function selectExpired()
}; // class Reminder
