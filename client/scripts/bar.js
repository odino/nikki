var state       = require('./state');

/**
 * Triggers a flash message of the given type.
 *
 * @param message
 * @param type
 */
var flash = function(message, type) {
    var bar         = $('#bar');
    var messageType = 'message-' + type;

    bar.finish();
    bar.removeClass();
    bar.addClass(messageType)
    bar.text(message);
    bar.fadeIn(200).delay(3000).fadeOut('slow');
}

/**
 * State object.
 *
 * @type {{info: info, alert: alert, error: error}}
 */
module.exports = {
    /**
     * Triggers an info message.
     *
     * @param message
     */
    info: function(message) {
        flash(message, 'info');
    },
    /**
     * Triggers an alert.
     *
     * @param message
     */
    alert: function(message) {
        flash(message, 'alert');
    },
    /**
     * Triggers an error.
     *
     * @param message
     */
    error: function(message) {
        flash(message, 'error');
    }
};