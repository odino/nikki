var reconfig = require('reconfig');
var socket   = require('./socket');
var events   = require('./events');

var config = new reconfig({});

socket.on('config', function(data){
    config.config = data;

    events.dispatch('config.loaded');
});

module.exports = config;