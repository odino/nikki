var app         = require('http').createServer(handler)
var argv        = require('yargs').argv;
var staticproxy = require('./static-proxy');
var socket      = require('./socket');
var serveIndex  = require('./serve-index');

var port = argv.port || 9123;

app.listen(port);
console.log('Nikki running on port ' + port)

function handler (req, res) {
    staticproxy('/bower_components', req, res);
    staticproxy('/client', req, res);
    serveIndex(req, res);
}

socket.startTheFun(app);