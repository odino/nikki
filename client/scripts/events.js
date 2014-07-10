/**
 * A simple event dispatcher.
 *
 * @type {{on: on, dispatch: dispatch}}
 */
var _ = require('lodash');

/**
 * Here we are gonna store all the
 * listener to the events.
 */
var listeners = {};

module.exports = {
  /**
   * Used to listen to an event.
   */
  on: function(event, callback) {
    if (!listeners[event]) {
      listeners[event] = [];
    }

    listeners[event].push(callback);
  },
  /**
   * Trigger an event.
   */
  dispatch: function(event, data) {
    if (listeners[event]) {
      _.each(listeners[event], function(listener){
        listener(data);
      });
    }
  }
}