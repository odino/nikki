/**
 * A simple wrapper for history events.
 *
 * @type {{past: Array, future: Array}}
 */
var events  = require('./events');

var history = {
    past:   [],
    future: []
};

events.on('resource.opened', function(resource){
    history.past.push($('[id="file-' + resource.path + '"]').text());
});

module.exports = history;