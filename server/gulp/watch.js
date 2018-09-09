var gulp = require('gulp');
var watch = require('gulp-watch');
var jest = require('gulp-jest').default;

gulp.task('watch', function()
{
	watch(['./game/**/*.js', './table/**/*.js', './tests/**/*.js'], function()
	{
		gulp.start('jest');
	});
});

gulp.task('jest', function()
{
	return gulp.src('tests')
		.pipe(jest
		({
			"preprocessorIgnorePatterns": 
			[
				"<rootDir>/dist/",
				"<rootDir>/node_modules/"
			],
			"automock": false
		}));
});
