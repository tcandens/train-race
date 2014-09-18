/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    watch: {
      sass: {
        files: '**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      }
    },
    sass: {
      dist: {
        files: [{
          'main.css': 'sass/main.scss'
        }]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit']);
  grunt.registerTask('watch', ['watch:sass']);

};
