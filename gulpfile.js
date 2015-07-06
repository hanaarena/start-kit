var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var stripdebug = require('gulp-strip-debug');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var nodemon = require('gulp-nodemon');

var AUTOPREFIXER_BROWSERS = [
	'last 3 versions',
	'ie >= 8',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

gulp.task('img', function() {
	return gulp.src('./public/images/*.{gif,jpg,png}')
		.pipe(imagemin({
			progressive: true,
			interlaced: true,
			svgoPlugins: [ {removeViewBox:false}, {removeUselessStrokeAndFill:false} ]
		}))
		.pipe(gulp.dest('./public/build/images/'))
});

gulp.task('css', function() {
	return gulp.src('./public/less/main.less')
		.pipe(less({}))
		.pipe(gulp.dest('./public/build/css/'))
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('./public/build/css/'))
});

gulp.task('jslint', function() {
	return gulp.src('./public/javascripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'))
});

gulp.task('scripts', function() {
	return gulp.src('./public/javascripts/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./public/build/js/'))
		.pipe(rename('all.min.js'))
		.pipe(stripdebug())
		.pipe(uglify())
		.pipe(gulp.dest('./public/build/js/'))
});

gulp.task('nodemon', function () {
	nodemon({
		script: 'bin/www',
		ignore: ['node_modules']
	})
});

gulp.task('watch', function () {
	gulp.watch('./public/less/**/*', ['css']);
	gulp.watch('./public/javascripts/**/*', ['jslint', 'scripts']);
});

gulp.task('images', ['img']);

gulp.task('build', ['css', 'jslint', 'scripts']);

gulp.task('run', function() {
	gulp.start('nodemon', 'watch');
});

gulp.task('default', ['build', 'run']);

