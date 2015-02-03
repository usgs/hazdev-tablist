'use strict';

var config = require('./config');

var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src
      ]
    }
  },
  source: {
    src: [],
    dest: config.build + '/' + config.src + '/hazdev-tablist.js',
    options: {
      alias: [
        './' + config.src + '/tablist/TabList.js:tablist/TabList'
      ]
    }
  },
  test: {
    src: config.test + '/test.js',
    dest: config.build + '/' + config.test + '/test.js',
    options: {
      external: [
        'tablist/TabList'
      ]
    }
  }
};


module.exports = browserify;