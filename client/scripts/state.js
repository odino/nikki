/**
 * This module keeps track of the state
 * of the IDE.
 *
 * @type {{openFile: null}}
 */
var events  = require('./events');

var state   = {
    openFile: null
}

events.on('resource.opened', function(resource){
    state.openFile = resource;
});

module.exports = state;