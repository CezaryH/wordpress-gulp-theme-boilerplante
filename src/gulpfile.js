/* jshint node:true */

// Include project requirements.
var gulp = require( 'gulp' ),
	p = require('gulp-load-plugins')();

// Sets assets folders.
var dirs = {
	dest : {
		dir : '../dist/',
		js : '../dist/js/scripts/',
		jsLib : '../dist/js/libs/',
		css : '../dist/css/',
		img : '../dist/img/',
		fonts : '../dist/fonts/',
	},
	js: './js/scripts/',
	jsLib: './js/libs',
	sass: './sass',
	images: './img',
	fonts: './fonts',
	views : './views/',
	controllers : './controllers'
};

gulp.task('clean', function () {
    // Clear the destination folder
    gulp.src([
		dirs.dest.dir + '/**/*.*',
		'../*.php'
	], { read: false })
    .pipe(clean({ force: true }));
});

gulp.task( 'css', function () {
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
	var jsFilter = p.filter('**/*.js'),
		sassFilter = p.filter('**/*.scss'),
		fontsFilter = p.filter('fonts/*.*');

    return p.bowerFiles()
		.pipe(jsFilter)
		.pipe(p.concat("vendor.js"))
		.pipe( p.uglify() )
    	.pipe(gulp.dest(dirs.dest.jsLib))
		.pipe(jsFilter.restore())
 		.pipe(sassFilter)
		.pipe(p.debug())
		.pipe(p.sass({
			outputStyle: 'compressed',
			includePaths : ['./bower_components/bootstrap-sass-official/vendor/assets/stylesheets']
		}))
		.pipe(p.debug())
		.pipe(p.autoprefixer())
		.pipe(gulp.dest(dirs.dest.css))
		.pipe(sassFilter.restore())
		.pipe(fontsFilter)
		.pipe(gulp.dest(dirs.dest.fonts));
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
        .pipe(p.useref.assets())
        .pipe(jsFilter)
        .pipe(p.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(p.csso())
        .pipe(cssFilter.restore())
        .pipe(p.useref.restore())
        .pipe(p.useref())
        .pipe(gulp.dest('dist'))
        .pipe(p.size());
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



