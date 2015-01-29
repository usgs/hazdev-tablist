'use strict';

var config = require('./config');

var cssmin = {
  dist: {
    cwd: config.build + '/' + config.src,
    dest: config.dist,
    expand: true,
    src: [
      '**/*.css'
    ]
  }
};

module.exports = cssmin;