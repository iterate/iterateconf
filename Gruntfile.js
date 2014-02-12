/*jshint node:true*/
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

  // configurable paths
  var appPaths = {
    app: 'app',
    dist: 'www'
  };
  var cachebust = +(new Date());

  grunt.initConfig({
    appConfig: appPaths,
    cachebust: cachebust,
    watch: {
      compass: {
        files: ['<%= appConfig.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      jshint: {
        files: '<%= jshint.all %>',
        tasks: ['jshint']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= appConfig.app %>/*.html',
          '{.tmp,<%= appConfig.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= appConfig.app %>}/scripts/{,*/}*.js',
          '<%= appConfig.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
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
      dist: ['.tmp', '<%= appConfig.dist %>/*'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true
      },
      all: [
        'Gruntfile.js',
        'bin/{,*/}*.js',
        '<%= appConfig.app %>/scripts/{,*/}*.js',
        '!<%= appConfig.app %>/scripts/libs/*',
        '!<%= appConfig.app %>/scripts/data/*'
      ]
    },
    compass: {
      options: {
        cssDir: '.tmp/styles',
        sassDir: '<%= appConfig.app %>/styles',
        imagesDir: '<%= appConfig.app %>/images',
        javascriptsDir: '.tmp/scripts',
        relativeAssets: true,
        force: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    // requirejs does concat
    /*concat: {
      dist: {}
    },*/
    requirejs: {
      dist: {
        // Options:
        // https://github.com/jrburke/r.js/blob/master/build/example.build.js
        options: {
          name: 'main',
          mainConfigFile: 'app/scripts/main.js',
          out: '<%= appConfig.dist %>/scripts/main.<%= cachebust %>.js',
          baseUrl: 'app/scripts',
          preserveLicenseComments: false,
          generateSourceMaps: true,
          useStrict: true,
          almond: true,
          replaceRequireScript: [{
            files: ['<%= appConfig.dist %>/index.html'],
            module: 'main',
            modulePath: 'scripts/main.<%= cachebust %>'
          }],
          optimize: 'uglify2',
          wrap: true
          //uglify2: {} // https://github.com/mishoo/UglifyJS2
        }
      }
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
    cssmin: {
      dist: {
        files: {
          '<%= appConfig.dist %>/styles/index.<%= cachebust %>.css': [
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

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'compass:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'jshint',
    'clean:dist',
    'compass:dist',
    'useminPrepare',
    'concat',
    'htmlmin:dist',
    'cssmin',
    'copy',
    'usemin',
    'htmlmin:deploy',
    'requirejs',
    'replace',
    'manifest'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
