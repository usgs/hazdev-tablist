'use strict';

var config = require('./config');

var replace = {
  dist: {
    options: {
      patterns: [{
        match: /tablist\/tablist\.css/g,
        replacement: 'hazdev-tablist.css',
      }]
    },
    files: [{
      cwd: config.dist,
      expand: true,
      src: '*.html',
      dest: config.dist
    }]
  }
};

module.exports = replace;