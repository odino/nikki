/**
 * Wrapping socket.io so that
 * every other module can include
 * it as a dependency and doesnt need
 * to be injected.
 */
module.exports = io('http://localhost:' + window.location.port)