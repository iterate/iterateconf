/*jshint node:true,camelcase:false*/
'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.loadTasks('./tasks');

  // configurable paths
  var appPaths = {
    app: 'app',
    dist: 'public'
  };
  var cachebust = +(new Date());

  grunt.initConfig({
    appConfig: appPaths,
    cachebust: cachebust,
    watch: {
      scripts: {
        files: ['<%= jshint.browser %>'],
        tasks: ['jshint:browser', 'transpilejs']
      },
      nodescripts: {
        files: ['<%= jshint.node %>'],
        tasks: ['jshint:node']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= appConfig.app %>/*.html',
          '<%= appConfig.app %>/styles/{,*/}*.css',
          '.tmp/scripts/{,*/}*.js',
          '<%= appConfig.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
      }
    },
    browserify: {
      dist: {
        options: {
          transform: [['babelify', { presets: ['es2015'] }]]
        },
        files: {
          '.tmp/scripts/iterateconf.js': '<%= appConfig.app %>/scripts/main.js'
        }
      }
    },
    connect: {
      options: {
        port: 9090,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '<%= appConfig.dist %>')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: ['.tmp'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true
      },
      node: [
        'Gruntfile.js',
        'bin/{,*/}*.js',
        'tasks/{,*/}*.js'
      ],
      browser: [
        '<%= appConfig.app %>/scripts/{,*/}*.js',
        '!<%= appConfig.app %>/scripts/vendor/*'
      ]
    },
    useminPrepare: {
      html: '<%= appConfig.app %>/index.html',
      options: {
        dest: '<%= appConfig.dist %>'
      }
    },
    usemin: {
      html: ['<%= appConfig.dist %>/{,*/}*.html'],
      css: ['<%= appConfig.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= appConfig.dist %>']
      }
    },
    autoprefixer: {
      dist: {
        options: {
          browsers: [
            'last 2 version'
          ],
          cascade: true
        },
        src: '<%= appConfig.dist %>/styles/index.css'
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= appConfig.dist %>/styles/index.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= appConfig.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeCommentsFromCDATA: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true
        },
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>',
          src: '*.html',
          dest: '<%= appConfig.dist %>'
        }]
      },
      deploy: {
        options: {
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '<%= appConfig.dist %>',
          src: '*.html',
          dest: '<%= appConfig.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>',
          dest: '<%= appConfig.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'images/**/*'
          ]
        }]
      }
    }

  });

  grunt.registerTask('transpilejs', [
    'browserify'
  ]);

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'transpilejs',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'jshint',
    'clean:dist',
    'useminPrepare',
    'transpilejs',
    'htmlmin:dist',
    'cssmin',
    'autoprefixer',
    'copy',
    'usemin',
    'htmlmin:deploy'
  ]);

  grunt.registerTask('default', [ 'build' ]);
};
