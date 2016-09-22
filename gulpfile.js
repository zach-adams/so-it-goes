var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require('browserify');
var uglify = require('gulp-uglify');

var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var gutil = require('gulp-util');

gulp.task('compress', function() {
	var b = browserify({
		entries: './src/app.js',
		debug: true
	});

	return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.start('compress');
	gulp.watch('src/**/*.js', ['compress']);
});

gulp.task('default', ['watch']);