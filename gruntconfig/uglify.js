'use strict';

var config = require('./config');

var uglify = {
  dist: {
    files: {}
  }
};

// uglify from build into dist
[
  'tablist/TabList.js'
].forEach(function (file) {
  uglify.dist.files[config.dist + '/' + file] = config.build + '/src/' + file;
});

// uglify from build into dist
[
  'example.js'
].forEach(function (file) {
  uglify.dist.files[config.dist + '/' + file] = config.build + '/test/' + file;
});



module.exports = uglify;
