var socket = io('http://localhost:9123');

require('./fs')(socket);
require('./resource')(socket);
require('./keyboard-shortcuts')(socket);
require('./ui');

socket.emit('boot', {path: window.location.pathname});