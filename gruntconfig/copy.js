'use strict';

var config = require('./config');

var copy = {
  test: {
    cwd: config.test,
    dest: config.build + '/' + config.test,
    expand: true,
    src: '*.html'
  }
};

module.exports = copy;