module.exports = require("./all.js")

function to_comment(value) {
    if (typeof value != "string") value = JSON.stringify(value, function(key, value) {
        return typeof value == "function" ? "<[ " + value + " ]>" : value;
    }, 2);
    return "// " + value.replace(/\n/g, "\n// ");
}

if (+process.env["UGLIFY_BUG_REPORT"]) module.exports.minify = function(files, options) {
    if (typeof options == "undefined") options = "<<undefined>>";
    var code = [
        "// UGLIFY_BUG_REPORT",
        to_comment(options),
    ];
    if (typeof files == "string") {
        code.push("");
        code.push("//-------------------------------------------------------------")
        code.push("// INPUT CODE", files);
    } else for (var name in files) {
        code.push("");
        code.push("//-------------------------------------------------------------")
        code.push(to_comment(name), files[name]);
    }
    if (options.sourceMap && options.sourceMap.url) {
        code.push("");
        code.push("//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9");
    }
    var result = { code: code.join("\n") };
    if (options.sourceMap) result.map = '{"version":3,"sources":[],"names":[],"mappings":""}';
    return result;
};

function infer_options(options) {
    var result = module.exports.minify("", options);
    return result.error && result.error.defs;
}

module.exports.default_options = function() {
    var defs = infer_options({ 0: 0 });
    Object.keys(defs).forEach(function(component) {
        var options = {};
        options[component] = { 0: 0 };
        if (options = infer_options(options)) {
            defs[component] = options;
        }
    });
    return defs;
};
