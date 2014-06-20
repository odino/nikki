var state   = require('./state');
var history = require('./history');
var events  = require('./events');

module.exports = function(socket) {
    socket.on('resource.opened', function(resource){
        events.dispatch('resource.opened', resource);
    });
}