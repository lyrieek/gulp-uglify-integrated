# gulp-uglify-integrated

主要解决gulp-uglify两个问题
1. gulp-uglify使用了很多过时的有安全问题的包
2. uglify的包结构有问题，是动态导入的，没法打包，这个包将uglify内置，可以打包

```
const uglify = require("./index.js")
const gulp = require("gulp")

gulp.src("./...js")
	.pipe(uglify())
    .pipe(gulp.dest("./dist"))
```

uglify()可以加入参数
    - logger 日志，默认使用`log4js`