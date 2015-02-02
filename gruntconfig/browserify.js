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
  'example/index': {
    src: config.example + '/index.js',
    dest: config.build + '/' + config.example + '/index.js',
    options: {
      external: 'tablist/TabList'
    }
  },
  'example/usability': {
    src: config.example + '/usability.js',
    dest: config.build + '/' + config.example + '/usability.js',
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