var state = require('./state');
var ui    = require('./ui');

/**
 * Sets a new bar up, by interrupting 
 * the previous one, adding a message and
 * a style to the new one.
 * 
 * The setup method will expect you to call
 * bar.show() to actually make it visible.
 */
var setupBar = function(message, type) {
  var bar         = ui.bar();
  
  bar.finish();
  bar.removeClass();
  bar.addClass(type)
  bar.text(message);
  
  return bar;
};

/**
 * Triggers a flash message of the given type.
 *
 * @param message
 * @param type
 */
var flash = function(message, type) {
  var bar = setupBar(message, 'message-' + type);
  bar.fadeIn(200).delay(3000).fadeOut('slow');
};

/**
 * State object.
 *
 * @type {{info: info, alert: alert, error: error}}
 */
module.exports = {
  hide: function() {
    ui.bar().removeClass().hide();
  },
  isOpen: function() {
    return ui.bar().is(':visible');
  },
  question: function() {
    var bar = ui.bar();
    
    return this.isOpen() && bar.hasClass('message-question') && bar;
  },
  ask: function(message, event, subject) {
    var bar = setupBar(message + ' (type y/n)', 'message-question');
    bar.attr('event', event);
    bar.attr('subject', JSON.stringify(subject));
    bar.show();
    bar.focus();
  },
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