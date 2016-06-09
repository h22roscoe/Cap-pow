// Karma configuration
// Generated on Thu May 26 2016 13:34:38 GMT+0100 (BST)

module.exports = function (config) {
    configuration = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.6/socket.io.min.js',
            'https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js',
            {
                pattern: 'public/images/*.png',
                watched: false,
                included: false,
                served: true
            },
            {
                pattern: 'public/data/*.json',
                watched: false,
                included: false,
                served: true
            },
            'public/lib/quintus-all.js',
            'public/src/player.js',
            'public/src/powerup.js',
            'public/src/flag.js',
            'public/src/game.js',
            'spec/tests/*.js'
        ],

        proxies: {
            '/images': 'http://localhost:9876/images',
            '/data': 'http://localhost:9876/data'
        },

        // list of files to exclude
        exclude: [
            '**/*.swp'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox'],

        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    }

    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }

    config.set(configuration);
}
