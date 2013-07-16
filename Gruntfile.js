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
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };
  var cachebust = +(new Date());

  grunt.initConfig({
    yeoman: yeomanConfig,
    cachebust: cachebust,
    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
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
          '<%= yeoman.app %>/*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
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
              mountFolder(connect, 'dist')
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
      dist: ['.tmp', '<%= yeoman.dist %>/*'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true
      },
      all: [
        'Gruntfile.js',
        'update-program.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/libs/*',
        '!<%= yeoman.app %>/scripts/data/*'
      ]
    },
    compass: {
      options: {
        cssDir: '.tmp/styles',
        sassDir: '<%= yeoman.app %>/styles',
        imagesDir: '<%= yeoman.app %>/images',
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
          out: 'dist/scripts/main.<%= cachebust %>.js',
          baseUrl: 'app/scripts',
          preserveLicenseComments: false,
          generateSourceMaps: true,
          useStrict: true,
          almond: true,
          replaceRequireScript: [{
            files: ['dist/index.html'],
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
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/index.<%= cachebust %>.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css'
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
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      },
      deploy: {
        options: {
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    replace: {
      dist: {
        src: ['<%= yeoman.dist %>/index.html'],
        dest: '<%= yeoman.dist %>/',
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
          basePath: '<%= yeoman.dist %>',
          verbose: false,
          timestamp: true
        },
        src: [
          'scripts/{,*/}*.js',
          'styles/{,*/}*.css'
        ],
        dest: '<%= yeoman.dist %>/manifest.appcache'
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'images/**/*'
          ]
        }]
      }
    }
  });

  //grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'compass:server',
      //'livereload-start',
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
