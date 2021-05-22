'use strict';

const log4js = require('log4js')
const log = log4js.getLogger();

log4js.configure({
  appenders: {
    console: {
      type:     "console"
    },
    system: {
      type:        "dateFile",
      category:    "system",
      filename:    "logs/system.log",
      pattern:     "-yyyy-MM-dd",
      keepFileExt: true
    },
    wrapErr: {
      type:     "logLevelFilter",
      appender: "system",
      level:    "debug"
    }
  },
  categories: {
    default: {
      appenders: [
        "console",
        "wrapErr"
      ],
      level: "all"
    }
  }
});

// sample
/*
log.trace('Some trace messages')
log.debug('Some debug messages')
log.info('Some info messages')
log.warn('Some warn messages')
log.error('Some error messages')
log.fatal('Some fatal messages')
*/

module.exports = log;
