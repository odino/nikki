/**
 * A simple proxy for serving aliased client files.
 *
 * @type {*}
 */
var fs   = require('fs');
var p    = require('path');
var url  = require('url');

var contentTypes = {
    '.js':      'application/javascript',
    '.css':     'text/css',
    '.eot':     'application/vnd.ms-fontobject',
    '.ttf':     'font/ttf',
    '.woff':    'application/font-woff',
    '.svg':     'image/svg+xml'
};

module.exports = function(path, req, res) {
    var parts = req.url.split(path);


    if (parts[0] == '') {
        fs.readFile(p.join(__dirname, '..', path, url.parse(parts[1]).pathname),
            function (err, data) {

                res.writeHead(200, {'content-type': contentTypes[p.extname(url.parse(parts[1]).pathname)]});
                res.end(data);
            });
    };
}