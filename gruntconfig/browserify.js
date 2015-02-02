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
  'tablist/TabList': {
    src: [],
    dest: config.build + '/' + config.src + '/tablist/TabList.js',
    options: {
      alias: [
        './' + config.src + '/tablist/TabList.js:tablist/TabList'
      ]
    }
  },
  'test/example': {
    src: config.test + '/example.js',
    dest: config.build + '/' + config.test + '/example.js',
    options: {
      external: 'tablist/TabList'
    }
  },
  'test/usability': {
    src: config.test + '/usability.js',
    dest: config.build + '/' + config.test + '/usability.js',
    options: {
      external: 'tablist/TabList'
    }
  },
  'test/index': {
    src: config.test + '/index.js',
    dest: config.build + '/' + config.test + '/index.js'
  }
};


module.exports = browserify;