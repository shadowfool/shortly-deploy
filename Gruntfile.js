module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      client: {
        src: ['public/client/**/*.js', 'public/lib/**/*.js'],
        dest: 'public/dest/client.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      client: {
        src: 'public/dest/client.js',
        dest: 'public/dest/client.min.js'
      }
    },

    eslint: {
      target: [
        'public/client/**/*.js',
        'public/lib/**/*.js'
      ]
    },

    cssmin: {  
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
    gitadd: {
      client: {
        options: {
          force: false,
          all: true
        }
      }
    },
    gitcommit: {
      client: {
        options: {
          message: 'Autocommit',
          allowEmpty: true
        }
      }
    },
    gitpush: {
      client: {
        options: {
          remote: 'live'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('push', ['gitadd', 'gitcommit', 'gitpush']);
  grunt.registerTask('deploy', [
    // add your deploy tasks here
  ]);

  //grunt.registerTask('concat', ['concat']);

};
