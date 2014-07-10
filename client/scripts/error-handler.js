/**
 * The error handler defines some behaviours
 * for when nikki decides to go bonkers.
 * 
 * Nothing weird happens here, as we are mainly
 * responsible for informing the user that
 * something weird is going on.
 */
var bar     = require('./bar');
var socket  = require('./socket');

/**
 * Generic error wrapper for when socket.io
 * wants to have some fun wiith us.
 */
socket.on('error', function(error) {
  if (error.type === 'TransportError') {
    bar.error("Aww, an awful error happened: " + error.description.message);
  } else {
    console.log(error);
  }
});

/**
 * Displaying errors.
 */
socket.on('server.error', function(error) {
  bar.error(error);
});

/**
 * I sense nastiness.
 */
socket.on('server.alert', function(error) {
  bar.alert(error);
});