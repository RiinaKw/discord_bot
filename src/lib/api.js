'use strict'

const request = require('request')
const log = require('../lib/log4js')

class Api {
  constructor () {
    this.urlBase = 'https://discord.com/api/v8'
    this.token = require('../../config/token')
  }

  get (apiName) {
    return this.send('get', apiName)
  }

  post (apiName, json) {
    return this.send('post', apiName, json)
  }

  delete (apiName) {
    return this.send('delete', apiName)
  }

  send (method, apiName, json) {
    const options = {
      uri: this.urlBase + apiName,
      method: method,
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bot ' + this.token
      },
      json: json
    }
    log.debug(method, options)

    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        log.debug('status code', res.statusCode)
        if (err) {
          reject(err.message)
        } else if (parseInt(res.statusCode / 100) !== 2) {
          reject(res.statusMessage)
        } else {
          let json = body
          if (!json) {
            json = {}
          } else if (typeof body === 'string') {
            json = JSON.parse(body)
          }
          resolve(json)
        }
      })
    })
  }
}
const api = new Api()

module.exports = api
