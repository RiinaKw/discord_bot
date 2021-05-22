'use strict'

const mariadb = require('mariadb')

try {
  const dbparams = require('../config/database')
  if (!dbparams.database) {
    throw new Error('no database selected')
  }

  const pool = mariadb.createPool(dbparams)
  const promise = pool.getConnection()

  module.exports = promise
} catch (e) {
  module.exports = new Promise(() => { throw e })
}
