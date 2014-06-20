/**
 * A simple utility to serve the index.html.
 *
 * @type {*}
 */
var fs = require('fs');

module.exports = function(req, res) {
    fs.readFile(__dirname + '/../client/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('A subtle error happened. Embarassing.');
        }

        res.writeHead(200);
        res.end(data);
    });
}