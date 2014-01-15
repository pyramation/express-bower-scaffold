module.exports = function (grunt) {
    grunt.initConfig({
        dist: {
            // the files to concatenate
            src: ['components/*.js', 'lib/*.js'],
            // the location of the resulting JS file
            dest: 'dist/app.js'
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                'components/jquery/jquery.js',
                'components/bootstrap/dist/js/bootstrap.js'
                ],
                dest: 'dist/app.js',
            },
        },
        uglify: {
            dist: {
                files: {
                    'dist/app.min.js': 'dist/app.js'
                }
            }
        },
        jshint: {
            // define the files to lint
            files: ['lib/extensions.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
                options: {
                    // more options here if you want to override JSHint defaults
                    evil: true,
                    globals: {
                        jQuery: true,
                        console: true,
                        module: true
                    }
                }
        }
    });

    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
