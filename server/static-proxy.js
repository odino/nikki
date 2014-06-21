/**
 * A simple proxy for serving aliased client files.
 *
 * @type {*}
 */
var fs   = require('fs');
var p    = require('path');

var contentTypes = {
    '.js': 'application/javascript',
    '.css': 'text/css'
};

module.exports = function(path, req, res) {
    var parts = req.url.split(path);

    if (parts[0] == '') {
        fs.readFile(__dirname + '/../' + path + '/' + parts[1],
            function (err, data) {
                res.writeHead(200, {'content-type': contentTypes[p.extname(parts[1])]});
                res.end(data);
            });
    }
}