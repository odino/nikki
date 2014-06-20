var socket      = io('http://localhost:9123');
var fs          = require('./fs')(socket);
var resource    = require('./resource')(socket);
var keyboard    = require('./keyboard')(socket);

socket.emit('boot', { path: window.location.pathname });