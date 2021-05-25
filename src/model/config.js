'use strict'

class ModelConfig extends require('./base') {
  get TABLE () {
    return 'configs'
  }

  async select (name) {
    const query = this.connection.query(
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

  insert (name, value) {
    return this.connection.query(
      `INSERT INTO ${this.TABLE} (name, value) VALUES (?, ?);`,
      [name, value]
    )
  }

  update (name, value) {
    return this.connection.query(
      `UPDATE ${this.TABLE} SET value = ? WHERE name = ?;`,
      [value, name]
    )
  }
} // class Config

module.exports = async () => {
  const db = new ModelConfig()
  await db.connect()
  return db
}
