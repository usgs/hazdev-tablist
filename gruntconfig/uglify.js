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
  uglify.dist.files[config.dist + '/' + file] = config.build + '/' + config.src + '/' + file;
});


module.exports = uglify;
