/**
 * A simple wrapper for KeyboardJS.
 *
 * @type {exports}
 */
module.exports = {
    on: function(combination, action) {
        KeyboardJS.on(combination, action);
    }
};