'use strict';

var config = require('./config');

var connect = {
  options: {
    hostname: '*'
  },
  build: {
    options: {
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src
      ],
      port: 8000
    }
  },
  dist: {
    options: {
      base: [
        config.dist
      ],
      keepalive: true,
      port: 8002
    }
  }
};

module.exports = connect;