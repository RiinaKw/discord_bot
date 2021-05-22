'use strict'

const mariadb = require('mariadb')
const process = require('../lib/process')
const log = require('../lib/log4js')

try {
  const dbparams = require('../../config/database')
  if (!dbparams.database) {
    throw new Error('no database selected')
  }

  const pool = mariadb.createPool(dbparams)

  module.exports = pool.getConnection()
    .then(result => {
      log.debug('mariadb connect success')
      return result
    })
    .catch(e => {
      process.shutdown(e)
    })
} catch (e) {
  process.shutdown(e)
}
