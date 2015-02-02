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
    'copy:mocha',
    'copy:test',
    'copy:example',
    'compass:build',
    'connect:build',
    'connect:test',
    'mocha_phantomjs'
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'build',
    'cssmin:dist',
    'uglify',
    'copy:dist',
    'connect:dist'
  ]);

  grunt.registerTask('default', [
    'build',
    'watch'
  ]);
};
