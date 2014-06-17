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
		cssLib : '../dist/css/libs/',
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
    return gulp.src([
		dirs.dest.dist,
		'../*.php'
	], { read: false })
    .pipe(p.clean({ force: true }));
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

gulp.task( 'css', function () {
	// Compile all SCSS files.
	
	return gulp.src( dirs.sass + '/*.scss' )
		.pipe(p.sass({
			//outputStyle: 'compressed'
			//sourceComments: 'map'
		}))
		.pipe(p.autoprefixer())
		.pipe(p.concat('style.min.css'))
		.pipe( gulp.dest( dirs.dest.css ) )
		.pipe(p.size())
});

gulp.task("bower-files", function(){
	var jsFilter = p.filter('**/*.js'),
		sassFilter = p.filter('**/*.scss'),
		fontsFilter = p.filter('**/fonts/*.*');

    return p.bowerFiles()
		.pipe(jsFilter)
		.pipe(p.concat("vendor.js"))
		.pipe( p.uglify() )
		//.pipe(p.inject(dirs.dest.views+'base.twig', {starttag: '<!-- inject:bowerJS -->'}))
    	.pipe(gulp.dest(dirs.dest.jsLib))
		.pipe(jsFilter.restore())
 		.pipe(sassFilter)
		.pipe(p.debug())
		.pipe(p.sass({
			//outputStyle: 'nested', //nested' or 'compressed', 'expanded' and 'compact'
			sourceComments: 'map',
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
		//.pipe(p.inject(dirs.dest.views+'html-header.twig', {starttag: '<!-- inject:bower:css -->'}))
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
		//.pipe(p.inject(dirs.dest.views+'base.twig', {starttag: '<!-- inject:js -->'}))
		.pipe( gulp.dest(dirs.dest.js))
		.pipe(p.size());
});

gulp.task( 'img', function () {
	// Optimize all images.
	return gulp.src( dirs.img + '/*.{png,jpg,gif}' )
		.pipe( p.imagemin({
			optimizationLevel: 7,
			progressive: true
		}) )
		.pipe( gulp.dest( dirs.dest.img ) )
		.pipe(p.size());
});

gulp.task( 'copy', function () {
	// copy files
	return gulp.src([dirs.fonts + '/*.*'])
		.pipe( gulp.dest( dirs.dest.fonts ) );
});

gulp.task('injectJs', function(){
	var js = gulp.src([dirs.dest.js + '/*.js']),
		jsLibs = gulp.src([dirs.dest.jsLib + '/*.js']),
		baseView = gulp.src(dirs.views+'scripts.twig');
		
	return baseView.pipe(p.inject(js, {starttag: '<!-- inject:js -->'}))
		   .pipe(p.inject(jsLibs, {starttag: '<!-- inject:libsJS -->'}))
		   .pipe(gulp.dest(dirs.dest.views));
});

gulp.task('injectCss', function(){
	var cssLib = gulp.src(dirs.dest.cssLib + '/*.css'),
		css = gulp.src(dirs.dest.css + '/*.css'),
		view = gulp.src(dirs.views+'html-header.twig');
		
	return view
		   //.pipe(p.inject(cssLib, {starttag: '<!-- inject:libsCss -->'}))
		   .pipe(p.inject(css, {starttag: '<!-- inject:css -->'}))
		   .pipe(gulp.dest(dirs.dest.views));
});

gulp.task( 'build', function () {
	return p.runSequence(
		'clean',
		'php',
		'twig',
		'css',
		'bower-files',
		'scripts',
		'img',
		'copy'
	)
});



