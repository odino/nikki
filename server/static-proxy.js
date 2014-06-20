var fs   = require('fs');
var p    = require('path');

var contentTypes = {
    '.js': 'application/javascript',
    '.css': 'text/css'
};

module.exports = function(path, req, res) {
    var parts = req.url.split(path);

    if (parts.length == 2) {
        fs.readFile(__dirname + '/../' + path + '/' + parts[1],
            function (err, data) {
                res.writeHead(200, {'content-type': contentTypes[p.extname(parts[1])]});
                res.end(data);
            });
    }
}