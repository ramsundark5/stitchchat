var config, gulp, reactCss, sass;

gulp = require('gulp');

sass = require('gulp-sass');

reactCss = require('gulp-react-native-css');

config = {
    src: ['../test/fixtures/**/*.scss'],
    dest: '../test/expected'
};

gulp.task('css', function() {
    return gulp.src(config.src).pipe(sass()).pipe(reactCss()).pipe(gulp.dest(config.dest));
});