/**
 * This module keeps track of the state
 * of the IDE.
 *
 * @type {{openFile: null}}
 */
var events  = require('./events');

var state   = {
    openFile: null,
    focus:    'fs',
    switchFocus: function() {
        if (this.focus === 'fs') {
            this.focus = 'tab';
        } else {
            this.focus = 'fs';
        }
    }
}

events.on('resource.opened', function(resource){
    state.openFile = resource;
});

module.exports = state;