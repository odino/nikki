var reconfig = require('reconfig');
var editor   = require('./editor');
var events   = require('./events');

var config = new reconfig();

config.bind = function(socket) {
    socket.on('config', function(data){
        config = new reconfig(data);

        events.dispatch('config', config);
    });
};

module.exports = config;