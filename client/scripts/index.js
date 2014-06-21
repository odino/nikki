var socket = io('http://localhost:' + window.location.port);

require('./fs')(socket);
require('./resource')(socket);
require('./keyboard-shortcuts')(socket);
require('./ui');
var bar = require('./bar');

socket.on('error', function(error) {
    bar.error("Aww, an awful error happened: " + error);
});

socket.emit('boot', {path: window.location.pathname});