var app         = require('http').createServer(handler)
var argv        = require('yargs').argv;
var path        = require('path');
var staticproxy = require('./static-proxy');
var socket      = require('./socket');
var serveIndex  = require('./serve-index');
var utils       = require('./utils');

var port = argv.port || 9123;

app.listen(port);

console.log('Open your browser at http://localhost:' + port + utils.getUserHomeDir() + ' to access the IDE')

function handler (req, res) {
    if (!path.extname(req.url)) {
        serveIndex(req, res);
    }

    staticproxy('/bower_components', req, res);
    staticproxy('/client', req, res);
}

/**
 * HERE STARTS THE FUN!
 */
socket.startTheFun(app);