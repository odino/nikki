var events  = require('./events');
var bar     = require('./bar');
var socket  = require('./socket');

socket.on('resource.opened', function(resource){
    events.dispatch('resource.opened', resource);
});

socket.on('resource.saved', function(resource){
    bar.info('The file ' + resource.name + ' has been saved (' + resource.path + ')');
});