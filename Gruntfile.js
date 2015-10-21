'use strict';

module.exports = function (grunt) {

  var gruntConfig = require('./gruntconfig');

  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);

  grunt.event.on('watch', function (action, filepath) {
    // Only lint the file that actually changed
    grunt.config(['jshint', 'scripts'], filepath);
  });

  grunt.registerTask('build', [
    'clean:build',
    'browserify',
    'copy:test',
    'postcss:build',
    'connect:build',
    'connect:test',
    'mocha_phantomjs'
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'build',
    'postcss:dist',
    'uglify',
    'connect:dist'
  ]);

  grunt.registerTask('default', [
    'build',
    'watch'
  ]);
};
