/* jshint node:true */

// Include project requirements.
var gulp = require( 'gulp' ),
	plugins = require('gulp-load-plugins')({ camelize: true });

// Sets assets folders.
var dirs = {
	dest : {
		dir : '../',
		js : '../js/scripts/',
		jsLib : '../js/libs/',
		css : '../css/',
		img : '../img/',
		fonts : '../fonts/',
	},
	js: '/js/scripts/',
	jsLib: '/js/libs',
	sass: '/sass',
	images: '/img',
	fonts: '/fonts'
};

gulp.task( 'scripts', function () {
	// Hint all JavaScript.
	gulp.src( dirs.js + '/*.js' )
		.pipe( plugins.jshint() )
		.pipe( plugins.jshint.reporter( 'default' ) )
		.pipe( plugins.uglify() )
		.pipe( gulp.dest(dirs.js));
});

gulp.task( 'sass', function () {
	// Compile all SCSS files.
	gulp.src( dirs.sass + '/*.scss' )
		.pipe( plugins.sass({
			outputStyle: 'compressed'
		}) )
		.pipe( gulp.dest( dirs.css ) );
});

gulp.task( 'optimize', function () {
	// Optimize all images.
	gulp.src( dirs.images + '/*.{png,jpg,gif}' )
		.pipe( plugins.imagemin({
			optimizationLevel: 7,
			progressive: true
		}) )
		.pipe( gulp.dest( dirs.dest.images ) );
});

gulp.task( 'watch', function () {

});

gulp.task( 'default', function () {
	gulp.run( 'scripts', 'sass' );
});
