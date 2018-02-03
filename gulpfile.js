const gulp = require('gulp');
const babel = require('gulp-babel');
const connect = require('gulp-connect');


gulp.task('babel', () =>
    gulp.src('src/icookie.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('connect', function() {
    connect.server({
        root: './'
    });
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*'], ['babel']);
});

gulp.task('default', ['connect', 'watch']);