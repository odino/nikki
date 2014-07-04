/**
 * A simple utility to serve the index.html.
 *
 * @type {*}
 */
var fs      = require('fs');
var path    = require('path');
var debug   = require('debug')('nikki:serve-index');

module.exports = function(req, res) {
    fs.readFile(path.join(__dirname, '..', 'client/index.html'), function (err, data) {
        debug('serving index.html')
        if (err) {
            res.writeHead(500);
            return res.end('A subtle error happened. Embarassing.');
        }

        res.writeHead(200);
        res.end(data);
    });
}