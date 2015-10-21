'use strict';

var config = require('./config');

var watch = {
  example: {
    files: [config.example + '/*.html', config.example + '/**/*.js'],
    tasks: ['jshint:examples']
  },
  css: {
    files: [config.src + '/**/*.scss'],
    tasks: ['postcss:build'],
    livereload: config.livereloadPort
  },
  gruntfile: {
    files: ['Gruntfile.js', 'gruntconfig/*.js'],
    tasks: ['jshint:gruntfile']
  },
  scripts: {
    files: [config.src + '/**/*.js'],
    tasks: ['jshint:scripts', 'browserify:source', 'mocha_phantomjs']
  },
  test: {
    files: [config.test + '/*.html', config.test + '/**/*.js'],
    tasks: ['jshint:tests', 'browserify:test', 'mocha_phantomjs']
  }
};

module.exports = watch;