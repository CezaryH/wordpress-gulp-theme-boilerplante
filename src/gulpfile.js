/* jshint node:true */

// Include project requirements.
var gulp = require( 'gulp' ),
	//jshintStylish = require('jshint-stylish'),
	jshintStylish = require('jshint-stylish-ex'),
	p = require('gulp-load-plugins')();

// Sets assets folders.
var dirs = {
	dest : {
		dir : '../',
		dist : '../dist/',
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
	img: './img/',
	fonts: './fonts/',
	views : './views/',
	controllers : './controllers/'
};

gulp.task('clean', function () {
    // Clear the destination folder
    gulp.src([
		dirs.dest.dist,
		'../*.php'
	], { read: false })
    .pipe(p.clean({ force: true }));
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
		.pipe(gulp.dest(dirs.dest.fonts))
		.pipe(p.size());
});

gulp.task( 'scripts', function () {
	// Hint all JavaScript.
	return gulp.src( dirs.js + '/*.js' )
		.pipe( p.jshint())
		.pipe( p.jshint.reporter(jshintStylish) )
		.pipe(p.concat("script.js"))
		.pipe( p.uglify())
		.pipe(p.rename({suffix:'.min'}))
		.pipe( gulp.dest(dirs.dest.js))
		.pipe(p.size());
});

gulp.task('twig', function () {
    return gulp.src(dirs.views + '/*.twig')
        .pipe(p.debug())
        .pipe(gulp.dest(dirs.dest.views));
});

gulp.task('php', function () {
    return gulp.src(dirs.controllers + '/*.php')
        .pipe(p.debug())
        .pipe(gulp.dest(dirs.dest.dir))
});

gulp.task( 'img', function () {
	// Optimize all images.
	gulp.src( dirs.img + '/*.{png,jpg,gif}' )
		.pipe( p.imagemin({
			optimizationLevel: 7,
			progressive: true
		}) )
		.pipe( gulp.dest( dirs.dest.img ) )
		.pipe(p.size());
});

gulp.task( 'copy', function () {
	// copy files
	gulp.src([dirs.fonts + '/*.*'])
		.pipe( gulp.dest( dirs.dest.fonts ) );
});



gulp.task( 'watch', function () {

});



