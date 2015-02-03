'use strict';

var config = require('./config');

var connect = {
  options: {
    hostname: '*'
  },
  build: {
    options: {
      base: [
        config.build + '/' + config.example,
        config.build + '/' + config.src,
        'node_modules'
      ],
      open: 'http://localhost:8000/',
      port: 8000
    }
  },
  test: {
    options: {
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src,
        'node_modules'
      ],
      open: 'http://localhost:8001/',
      port: 8001
    }
  },
  dist: {
    options: {
      base: [
        config.dist
      ],
      keepalive: true,
      open: 'http://localhost:8002/',
      port: 8002
    }
  }
};

module.exports = connect;