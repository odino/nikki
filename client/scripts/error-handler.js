var bar     = require('./bar');
var socket  = require('./socket');

socket.on('error', function(error) {
    bar.error("Aww, an awful error happened: " + error);
});

socket.on('server.error', function(error) {
    bar.error(error);
});