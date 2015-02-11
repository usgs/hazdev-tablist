'use strict';

var config = require('./config');

var uglify = {
  dist: {
    src: config.build + '/' + config.src + '/hazdev-tablist.js',
    dest: config.dist + '/' + 'hazdev-tablist.js'
  }
};

module.exports = uglify;
