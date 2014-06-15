/* jshint node:true */

// Include project requirements.
var gulp = require( 'gulp' ),
	p = require('gulp-load-plugins')();

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
	js: './js/scripts/',
	jsLib: './js/libs',
	sass: './sass',
	images: './img',
	fonts: './fonts',
	views : './views/',
	controllers : './controllers'
};

gulp.task( 'sass', function () {
	// Compile all SCSS files.
	
	return gulp.src( dirs.sass + '/*.scss' )
		.pipe(p.sass({
			outputStyle: 'compressed'
		}))
		.pipe(p.autoprefixer())
		.pipe( gulp.dest( dirs.dest.css ) )
		.pipe(p.size())
		.pipe(p.notify("Compilation complete."));
});

gulp.task("bower-files", function(){
    return p.bowerFiles()
    	.pipe(gulp.dest(dirs.dest.jsLib));
});

gulp.task( 'scripts', function () {
	// Hint all JavaScript.
	return gulp.src( dirs.js + '/*.js' )
		.pipe( p.jshint())
		.pipe( p.jshint.reporter( p.jshintStylish() ) )
		.pipe( p.uglify())
		.pipe( gulp.dest(dirs.dest.js));
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src([dirs.controllers, dire.views])
        .pipe($.useref.assets())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task( 'optimize', function () {
	// Optimize all images.
	gulp.src( dirs.images + '/*.{png,jpg,gif}' )
		.pipe( p.imagemin({
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
