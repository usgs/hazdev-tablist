'use strict';

var config = require('./config');

var compass = {
  build: {
    options: {
      sassDir: config.src + '/tablist/',
      specify: config.src + '/tablist/hazdev-tablist.scss',
      cssDir: config.build + '/' + config.src,
      environment: 'development'
    }
  }
};

module.exports = compass;