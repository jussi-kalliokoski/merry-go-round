"use strict";

var React = require("react");
var Document = require("../Document");
var CodeExamples = require("../CodeExamples");

var ExamplePage = React.createClass({
    render () {
        return (
            <Document>
                <div id="example" />
                <CodeExamples files={this.props.codeExamples} />
                <div dangerouslySetInnerHTML={{ __html: this.props.html }} />
                <script src={"/merry-go-round/assets/js/" + this.props.name + ".js"} />
            </Document>
        );
    },
});

module.exports = ExamplePage;
