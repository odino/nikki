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

module.exports = history;