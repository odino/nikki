var state   = require('./state');
var events  = require('./events');
var bar     = require('./bar');

module.exports = function(socket) {
    socket.on('resource.opened', function(resource){
        events.dispatch('resource.opened', resource);
    });

    socket.on('resource.saved', function(resource){
        bar.info('The file ' + resource.name + ' has been saved (' + resource.path + ')');
    });
}