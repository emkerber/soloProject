module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      files: ['Gruntfile.js', 'public/*.js', 'routes/*.js']
    },
    watch: {
      files: ['**/*.js'],
      tasks: ['jshint', 'uglify', 'copy']
    },
    copy: {
      main: {
        files: [
          // makes all src relative to cwd
          {expand: true, cwd: 'node_modules', src: ['angular/**',
          'angular-animate/**', 'angular-route/**'], dest: 'public/vendors'},
        ],
      },
    },
    uglify: {
     my_target: {
      //  options: {
      //    mangle: false
      //  },
       files: {
         'public/assets/client.min.js': ['client/dingDogSwitchApp.module.js',
         'client/dingDogSwitchApp.config.js', 'client/controllers/*.js']
       }
     }
   }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'uglify', 'copy']);

};
