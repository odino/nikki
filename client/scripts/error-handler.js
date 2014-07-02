var bar     = require('./bar');
var socket  = require('./socket');

socket.on('error', function(error) {
    if (error.type === 'TransportError') {
        bar.error("Aww, an awful error happened: " + error.description.message);
    } else {
        console.log(error);
    }
});

socket.on('server.error', function(error) {
    bar.error(error);
});