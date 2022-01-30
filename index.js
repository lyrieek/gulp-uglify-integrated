'use strict';
const eventStream = require('event-stream');
const log4js = require('log4js');
const applySourceMap = require('vinyl-sourcemaps-apply');
const uglify = require('./uglify-src/index');

module.exports = function(configure = {}) {
	let logger = configure.logger;
	if (!logger) {
		log4js.configure({
			appenders: { out: { type: 'stdout', layout: { type: 'basic' } } },
			categories: { default: { appenders: ['out'], level: 'info' } }
		});
		logger = log4js.getLogger("gulp-uglify");
	}
	return eventStream.map(function(file, callback) {
		if (file.isNull()) {
			return file;
		}

		if (file.isStream()) {
			logger.error(file)
			return;
		}

		const options = {
			output: {}
		}

		if (file.sourceMap) {
			options.sourceMap = {
				filename: file.sourceMap.file,
				includeSources: true
			};
			if (file.sourceMap.mappings) {
				options.sourceMap.content = file.sourceMap;
			}
		}

		const mangled = uglify.minify({
			[file.relative]: String(file.contents)
		}, options) || { error: "result is undefined" };

		if (mangled.error) {
			logger.error(file)
			logger.error("mangled:" + JSON.stringify(mangled.error))
			return;
		}

		if (mangled.warnings) {
			mangled.warnings.forEach(function(warning) {
				logger.warn('gulp-uglify [%s]: %s', file.relative, warning);
			});
		}

		file.contents = Buffer.from(mangled.code);

		if (file.sourceMap) {
			applySourceMap(file, JSON.parse(mangled.map));
		}

		callback(null, file);
	});
};
