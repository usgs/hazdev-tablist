'use strict';

var config = require('./config');

var connect = {
  options: {
    hostname: '*'
  },
  build: {
    options: {
      base: [
        config.build + '/' + config.src,
        config.example
      ],
      open: 'http://localhost:' + config.buildPort + '/example.html',
      port: config.buildPort
    }
  },
  test: {
    options: {
      base: [
        config.build + '/' + config.src,
        config.build + '/' + config.test,
        'node_modules'
      ],
      open: 'http://localhost:' + config.testPort + '/test.html',
      port: config.testPort
    }
  },
  dist: {
    options: {
      base: [
        config.dist,
        config.example
      ],
      keepalive: true,
      open: 'http://localhost:' + config.distPort + '/example.html',
      port: config.distPort
    }
  },
  example: {
    options: {
      base: [
        config.example,
        config.build + '/' + config.src
      ],
      livereload: config.livereloadPort,
      open: 'http://localhost:' + config.examplePort + '/example.html',
      port: config.examplePort
    }
  }
};

module.exports = connect;