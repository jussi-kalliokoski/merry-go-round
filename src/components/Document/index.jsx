"use strict";

var React = require("react");

var Document = React.createClass({
    render () {
        return (
            <html lang="en">
                <head>
                    <title>merry-go-round</title>
                    <link rel="stylesheet" href="/merry-go-round/assets/css/app.css" />
                </head>
                <body>
                    <div className="wrap">
                        { this.props.children }
                    </div>
                    <script src="//cdnjs.cloudflare.com/ajax/libs/prism/0.0.1/prism.min.js" />
                    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/prism/0.0.1/prism.min.css" />
                    <script src="/merry-go-round/assets/js/app.js" />
                </body>
            </html>
        );
    },
});

module.exports = Document;
