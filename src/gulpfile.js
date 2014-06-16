/* jshint node:true */

// Include project requirements.
var gulp = require( 'gulp' ),
	jshintStylish = require('jshint-stylish'),
	p = require('gulp-load-plugins')();

// Sets assets folders.
var dirs = {
	dest : {
		dir : '../dist/',
		js : '../dist/js/',
		jsLib : '../dist/js/libs/',
		css : '../dist/css/',
		img : '../dist/img/',
		fonts : '../dist/fonts/',
		views : '../dist/views/'
	},
	js: './js/scripts/',
	jsLib: './js/libs/',
	sass: './sass/',
	images: './img/',
	fonts: './fonts/',
	views : './views/',
	controllers : './controllers/'
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
		fontsFilter = p.filter('**/fonts/*.*');

    return p.bowerFiles()
		.pipe(jsFilter)
		.pipe(p.concat("vendor.js"))
		.pipe( p.uglify() )
    	.pipe(gulp.dest(dirs.dest.jsLib))
		.pipe(jsFilter.restore())
 		.pipe(sassFilter)
		.pipe(p.debug())
		.pipe(p.sass({
			//outputStyle: 'nested', //nested' or 'compressed', 'expanded' and 'compact'
			//sourceComments: 'map',
			includePaths : ['./bower_components/bootstrap-sass-official/vendor/assets/stylesheets'],
			onError: function (error) {
				p.util.log(p.util.colors.red(error));
				p.util.beep();
			},
			onSuccess: function () {
				p.util.log(p.util.colors.green('Sass styles compiled successfully.'));
			}			
		}))
		.pipe(p.debug())
		.pipe(p.autoprefixer())
		.pipe(p.flatten())
		.pipe(gulp.dest(dirs.dest.css))
		.pipe(sassFilter.restore())
		.pipe(fontsFilter)
		.pipe(p.debug())
		.pipe(gulp.dest(dirs.dest.fonts));
});

gulp.task( 'scripts', function () {
	// Hint all JavaScript.
	return gulp.src( dirs.js + '/*.js' )
		.pipe( p.jshint())
		.pipe( p.jshint.reporter(jshintStylish) )
		.pipe( p.uglify())
		.pipe( gulp.dest(dirs.dest.js));
});

gulp.task('html', function () {
    var phpFilter = p.filter('*.php');
    var twigFilter = p.filter('*.twig');

    return gulp.src([dirs.controllers + '/**/*.php', dirs.views + '/**/*.twig'], {read : false})
        .pipe(phpFilter)
        .pipe(p.debug())
        .pipe(gulp.dest('../'))
        .pipe(phpFilter.restore())
        //.pipe(p.debug())
        .pipe(twigFilter)
        //.pipe(p.debug())
        .pipe(gulp.dest(dirs.dest.views));
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



