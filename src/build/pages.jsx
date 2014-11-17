"use strict";

var fs = require("gulp");
var File = require("vinyl");
var through = require("through2");
var resolver = require("gulp-resolver");
var React = require("react");
var marked = require("marked");
var path = require("path");
var glob = require("glob");
var merge = require("event-stream").merge;
var Document = require("../components/Document");
var ExamplePage = require("../components/ExamplePage");

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
});

function render (filename, component) {
    var html = "<!DOCTYPE html>" + React.renderToStaticMarkup(component);

    return new File({
        path: filename,
        contents: new Buffer(html),
    });
}

function createIndexPage () {
    var stream = through.obj();

    var index = marked(require("fs").readFileSync("./node_modules/merry-go-round/README.md", "utf8"));

    stream.write(render("index.html", (<Document><div dangerouslySetInnerHTML={{ __html: index }} /></Document>)));

    process.nextTick(() => stream.end());

    return stream;
}

function createExamplePage (dir) {
    var stream = through.obj();

    var readme = require("fs").readFileSync(path.join(dir, "README.md"), "utf8");
    var title = /^# ([^\n]+)/.exec(readme)[1];
    var name = path.basename(dir);
    var html = marked(readme);

    var codeExamples = [];

    fs.src(path.join(dir, "*.{jsx,styl}")).pipe(through.obj(function (file, encoding, callback) {
        codeExamples.push({
            name: path.basename(file.path),
            language: path.extname(file.path).substr(1),
            contents: file.contents.toString(),
        });

        callback();
    }, function flush () {
        stream.write(render(path.join("examples", name, "index.html"), <ExamplePage
            title={title}
            name={name}
            html={html}
            codeExamples={codeExamples}
        />));

        process.nextTick(() => stream.end());
    }))
        .on("error", stream.emit.bind(stream, "error"));

    return stream;
}

function createExamplePages () {
    return merge.apply(null, glob.sync("./src/examples/*").map(createExamplePage));
}

function createPages () {
    return merge(createExamplePages(), createIndexPage())
        .pipe(resolver.html({
            assetsDir: "./merry-go-round/",
        }))
        .pipe(fs.dest("./merry-go-round/"));
};

module.exports = createPages;
