'use strict'

const mariadb = require('mariadb')
const dbparams = require('../config/database')
const pool = mariadb.createPool(dbparams)

const promise = pool.getConnection()

module.exports = promise
