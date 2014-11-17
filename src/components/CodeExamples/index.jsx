"use strict";

var React = require("react");

var FILE_TYPES = {
    jsx: "javascript",
    styl: "css",
};

var CodeExamples = React.createClass({
    getInitialState () {
        return {
            pageIndex: 0,
        };
    },

    renderExamples () {
        return this.props.files.map((file, index) => {
            var langClassName = "language-" + FILE_TYPES[file.language];
            var classNames = [
                langClassName,
                "code-examples__code",
            ];

            if ( index === this.state.pageIndex ) {
                classNames.push("code-examples__code--active");
            }

            return (
                <pre key={file.name} className={ classNames.join(" ") }>
                    <code
                        className={ langClassName }
                        dangerouslySetInnerHTML={{ __html: file.contents }}
                    />
                </pre>
            );
        });
    },

    selectPage (index) {
        this.setState({
            pageIndex: index,
        });
    },

    renderTabs () {
        return this.props.files.map((file, index) => {
            var classNames = [
                "code-examples__tab",
            ];

            if ( index === this.state.pageIndex ) {
                classNames.push("code-examples__tab--active");
            }

            return (
                <div
                    key={ file.name }
                    className={ classNames.join(" ") }
                    onClick={ this.selectPage.bind(this, index) }
                >
                    { file.name }
                </div>
            );
        });
    },

    render () {
        return (
            <div className="code-examples">
                <div className="code-examples__tabs">
                    { this.renderTabs() }
                    <div className="clear" />
                </div>
                { this.renderExamples() }
            </div>
        );
    },
});

module.exports = CodeExamples;
