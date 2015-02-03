'use strict';

var config = require('./config');

var uglify = {
  dist: {
    files: {}
  }
};

// uglify from build into dist
[
  'hazdev-tablist.js'
].forEach(function (file) {
  uglify.dist.files[config.dist + '/' + file] = config.build + '/src/tablist/' + file;
});

// uglify from build into dist
[
  'index.js',
  'usability.js'
].forEach(function (file) {
  uglify.dist.files[config.dist + '/' + file] = config.build + '/example/' + file;
});


module.exports = uglify;
