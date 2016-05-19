module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      client: {
        src: ['public/lib/jquery.js',
              'public/lib/underscore.js',
              'public/lib/backbone.js',
              'public/lib/handlebars.js',
              'public/client/app.js',
              'public/client/link.js',
              'public/client/links.js',
              'public/client/linkView.js',
              'public/client/linksView.js',
              'public/client/createLinkView.js',
              'public/client/router.js'],
        dest: 'public/dist/client.js'
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
        src: 'public/dist/client.js',
        dest: 'public/dist/client.min.js'
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
          'deploy'
          // 'concat',
          // 'uglify'
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
          force: true
        },
        files: {
          src: ['public/dist/client.min.js']
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
      grunt.task.run([ 'push' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('push', ['gitadd', 'gitcommit', 'gitpush']);

  var isProd = grunt.option('prod');
  grunt.registerTask('deploy', 
    ['concat', 'uglify', 'eslint', 'mochaTest', 'upload']
  );


  //grunt.registerTask('concat', ['concat']);

};
