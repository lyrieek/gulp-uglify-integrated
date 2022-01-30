const uglify = require("./index.js")
const gulp = require("gulp")

gulp.src("./uglify-src/all.js")
	.pipe(uglify())
    .pipe(gulp.dest("./test_dist"))
