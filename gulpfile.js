// Include gulp
var gulp = require('gulp');
var gulpSass = require('gulp-sass')(require('node-sass'));
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var inliner = require('gulp-inline-css');
var inlinesource = require('gulp-inline-source');
var imagemin = require('gulp-imagemin');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var cache = require('gulp-cached');
var plumber = require('gulp-plumber');
var argv = require('minimist')(process.argv.slice(2), {
	string: [
		'template'
		, 'recipient'
	]
	, boolean: [
		'litmus'
	]
	, alias: {
		t: 'template'
		, r: 'recipient'
		, l: 'litmus'
	}
});
var nodemailer = require('nodemailer');
var fs = require('fs');
var config = require('./config.json');


// Compile Our Sass
function sass() {
	return gulp.src('src/scss/*.scss')
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(gulpSass({
			outputStyle: 'compressed' 
			, errLogToConsole: true
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('src/css'))
		.pipe(notify("SASS task complete!"));
};
 
// Build our templates
function build() {
	return gulp.src('src/html/*.html')
		.pipe(plumber())
		.pipe(cache('templates'))
		.pipe(inlinesource({
			compress: false
		}))
		.pipe(inliner({
			removeStyleTags: false
		}))
		.pipe(gulp.dest('./output'))
		.pipe(notify("Build task complete!"))
		.pipe(livereload());
};

// Image task
function images() {
	return gulp.src('src/images/**/*')
		.pipe(imagemin({
			optimizationLevel: 3
			, progressive: true
			, interlaced: true
		}))
		.pipe(rename(function(path) {
			path.basename = path.basename.replace('@2x', '');
			return path;
		}))
		.pipe(gulp.dest('./output/images'));
};

// Watch Files For Changes
function watch() {
	livereload.listen();
	gulp.watch('src/scss/*.scss', gulp.series(sass, build)).on('change', function() {
		// Clear cache so all html templates are rebuilt.
		delete cache.caches['templates'];
	});
	gulp.watch('src/html/*.html', build);
	gulp.watch('src/images/**/*', images);
};

// Default Task
function first_run() {
	return gulp.series(
		sass
		, build
		, images
		, watch
	)();
};


// Email testing tasks
function send() {
	//console.log(argv);
	return sendEmail();
};

function sendEmail() {
	try {

		if (argv.template !== undefined) {

			var template_path = "./output/" + argv.template;

			var transporter = nodemailer.createTransport({
				service: 'Mailgun'
				, auth: {
					user: config.auth.mailgun.user
					, pass: config.auth.mailgun.pass
				}
			});

			var template_content = fs.readFileSync(template_path, encoding = "utf8");

			var mail_options = {
				from: config.email.from
				, to: argv.recipient || config.email.to
				, subject: config.email.subject + ' - ' + argv.template
				, html: template_content
			};

			if (argv.litmus) {
				mail_options.to = config.email.litmus;
			}

			transporter.sendMail(mail_options, function(error, info) {
				if (error) {
					throw console.error(error);
				} else {
					console.log('Message sent: ' + info.response);
				}
			});

		} else {
			throw "Please define a template name e.g. gulp send -t email.html, gulp send --template email.html";
		}

	} catch (e) {
		if (e.code == 'ENOENT') {
			console.error("There was an error. Check your template name to make sure it exists in './output'.");
		} else if(e instanceof TypeError) {
			console.error('There was an error. Please check your config.json to make sure everything is spelt correctly.');
		} else {
			console.error(e);
		}
	}
}

exports.build = build;
exports.images = images;
exports.default = first_run;
exports.watch = watch;
