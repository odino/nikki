/**
 * Setup the sockets.
 */
var socket = require('./socket');
var events = require('./events');

/**
 * Boot the config.
 */
require('./config');

/**
 * Once the config is loaded, boot the app.
 */
events.on('config.loaded', function(){
  require('./fs');
  require('./resource');
  require('./keyboard-shortcuts');
  require('./ui');
  require('./error-handler');

  /**
   * FUN TIMES AHEAD!
   */
  socket.emit('boot', {path: window.location.pathname});
});