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
    transpile: {
      main: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/scripts/',
          src: ['**/*.js'],
          dest: '.tmp/amdscripts/',
          ext: '.amd.js'
        }]
      }
    },
    concat: {
      amd: {
        src: '.tmp/amdscripts/**/*.amd.js',
        dest: '.tmp/iterateconf.amd.js'
      }
    },
    traceur: {
      options: {
        //sourceMaps: true,
        //freeVariableChecker: false,
        //experimental: true,
        blockBinding: true
      },
      dist: {
        files: {
          '.tmp/iterateconf.es3.amd.js': ['.tmp/iterateconf.amd.js']
        }
      }
    },
    wrapamd: {
      dist: {
        src: [
          '<%= appConfig.app %>/scripts/vendor/loader.js',
          '.tmp/iterateconf.es3.amd.js'
        ],
        dest: '.tmp/scripts/iterateconf.js',
        options: {
          barename: 'main',
          namespace: 'IterateConf'
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= appConfig.dist %>/scripts/iterateconf.js': [
            '<%= wrapamd.dist.dest %>'
          ]
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
    replace: {
      dist: {
        src: ['<%= appConfig.dist %>/index.html'],
        dest: '<%= appConfig.dist %>/',
        replacements: [
          {
            from: /<html lang="en">/,
            to: '<html manifest="manifest.appcache" lang="en">'
          },
          {
            from: /<%=cachebust%>/,
            to: function () {
              return cachebust;
            }
          }
        ]
      }
    },
    manifest: {
      dist: {
        options: {
          basePath: '<%= appConfig.dist %>',
          verbose: false,
          timestamp: true
        },
        src: [
          'scripts/{,*/}*.js',
          'styles/{,*/}*.css'
        ],
        dest: '<%= appConfig.dist %>/manifest.appcache'
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
    'transpile',
    'concat',
    'traceur',
    'wrapamd'
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
    'uglify',
    'htmlmin:dist',
    'cssmin',
    'autoprefixer',
    'copy',
    'usemin',
    'htmlmin:deploy',
    'replace',
    'manifest'
  ]);

  grunt.registerTask('default', [ 'build' ]);
};
