'use strict'

const log = require('../lib/log4js')
const defaultValues = require('../../config/default')

class ConfigManager {
  constructor () {
    this.map = new Map()
  }

  async connect () {
    if (this.db) return
    this.db = await require('../model/config')()
  }

  async load () {
    await this.connect()
    const entries = Object.entries(defaultValues)
    for (const [key, defaultValue] of entries) {
      await this.db.select(key)
        .then(row => {
          log.trace(`${key} from db, ${row.value}`)
          this.map.set(key, row.value)
        })
        .catch(e => {
          log.trace(`${key} from default, ${defaultValue}`)
          this.map.set(key, defaultValue)
          this.db.insert(key, defaultValue)
        })
    }
  }

  get (key) {
    return this.map.get(key)
  }

  set (key, value) {
    this.map.set(key, value)
    this.db.update(key, value)
    return value
  }
}

module.exports = new ConfigManager()
