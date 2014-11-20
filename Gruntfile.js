module.exports = function(grunt) {
  grunt.initConfig({

    // Documentation
    jsdoc2md: {
      api: {
        src: './lib/crawler.js',
        dest: './docs/api.md'
      }
    },

    // Custom tasks
    run: {

      // Run all the tests inside the test folder
      mocha: {
        args: [
          './node_modules/mocha/bin/mocha',
          './test/**/test-*.js',
          '--reporter',
          'spec',
          '--bail'
        ],
      },

      // Look for JavaScript errors
      hint: {
        args: [
          './node_modules/jshint/bin/jshint',
          './lib',
          './test',
          './examples',
          './Gruntfile.js'
        ],
      },

      // Runs test coverages
      istanbul: {
        args: [
          './node_modules/istanbul/lib/cli.js',
          'cover',
          './node_modules/mocha/bin/_mocha',
          '--report',
          'lcovonly',
          '--',
          '--reporter',
          'spec',
          '--bail',
          './test/**/test-*.js'
        ]
      },

      // Send coverage results to Coveralls
      coveralls: {
        exec: 'cat ./coverage/lcov.info | ' +
          './node_modules/coveralls/bin/coveralls.js'
      }
    }
  });

  // Loading NPM Grunt plugins
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

  // Registering custom named tasks for easy access
  grunt.registerTask('test', [
    'run:hint',
    'run:mocha'
  ]);


  grunt.registerTask('docs', [
    'jsdoc2md'
  ]);

  // This is the command that Travis will run
  grunt.registerTask('travis', [
    'run:hint',
    'run:istanbul',
    'run:coveralls'
  ]);
};
