const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new (winston.transports.File)({
      name: 'error-log',
      filename: './logs/error.log',
      level: 'error'
    }),
    new (winston.transports.File)({
      name: 'combined-log',
      filename: './logs/combined.log',
    })
  ]
});

module.exports = logger;
