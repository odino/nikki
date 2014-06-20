/**
 * A simple wrapper over EventEmitter.
 *
 * @type {{on: on, dispatch: dispatch}}
 */
var _ = require('lodash');

var listeners = {};

module.exports = {
    on: function(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }

        listeners[event].push(callback);
    },
    dispatch: function(event, data) {
        if (listeners[event]) {
            _.each(listeners[event], function(listener){
                listener(data);
            });
        }
    }
}