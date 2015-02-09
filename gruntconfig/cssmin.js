'use strict';

var config = require('./config');

var cssmin = {
  dist: {
    src: config.build + '/' + config.src + '/hazdev-tablist.css',
    dest: config.dist + '/hazdev-tablist.css'
  }
};

module.exports = cssmin;