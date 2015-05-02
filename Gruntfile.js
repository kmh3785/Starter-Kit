module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
     sass: {                              // Task 
        dist: {                            // Target 
          options: {                       // Target options 
            style: 'compressed'
          },
          files: {                         // Dictionary of files 
            'dist/css/style.min.css': 'src/scss/style.scss',  // 'destination': 'source' 
          }
        }
      },

       autoprefixer: {
        options: {
          browsers: ['last 2 versions'],
        },
        css: {
          src: 'dist/css/style.min.css',
          dest: 'dist/css/style.min.css'
        },
      },

      uglify: {
        my_target: {
          files: {
            'dist/js/scripts.min.js': ['src/js/scripts.js'],
          }
        }
      },
       imagemin: {                          // Task 
          dynamic: {                         // Another target 
            options: {
              optimizationLevel:3, // Optimization level for PNG (3 is default)
              progressive: true, // Lossless vs progressive conversion for jpg
              svgoPlugins: [{ removeViewBox: false }], // svgo settings
            },
            files: [{
              expand: true,                  // Enable dynamic expansion 
              cwd: 'src/img/',                   // Src matches are relative to this path 
              src: ['**/*.{png,jpg,gif,svg}', 'overlayPatterns/*.{.png,.gif,.jpg,svg}'],   // Actual patterns to match 
              dest: 'dist/img'                  // Destination path prefix 
            }],
          },
        },

      htmlmin: {                                     // Task
        dist: {
          options: {
             removeComments: true,
             collapseWhitespace: true
          },
          files: [{
             expand: true,
             cwd: 'src',
             src: '**/*.php',
             dest: 'dist'
          }]
       },
      },
    
      watch: {
        css: {
            files: '**/*.scss',
            tasks: ['sass', 'newer:autoprefixer'],
            options: {
              // livereload: {
              //   port: 9000,
              //   key: grunt.file.read('path/to/ssl.key'),
              //   cert: grunt.file.read('path/to/ssl.crt')
              //   // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener 
              // }
            },
        },
        scripts: {
            files: [
                'src/js/scripts.js'],
            tasks: ['newer:uglify'],
            options: {
            },
        },

        html: {
            files: [
                'src/*.php',
            ],
            tasks: ['newer:htmlmin'],
            options: {
            },
        },
         images: {
            files: [
                'src/img/*.{gif,svg,png,jpg}',
            ],
            tasks: ['newer:imagemin'],
            options: {

            },
        },
      
      },
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-newer');

  // Default task(s).
  grunt.registerTask('build', ['htmlmin','uglify','sass','autoprefixer','imagemin']);

};