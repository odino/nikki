var fs        = require('fs');
var proc      = require('child_process');
var blankline = console.log;

/**
 * Daemonize a nikki process.
 * 
 * Here we are gonna relaunch
 * ourselves with the --deamon
 * option.
 */
module.exports = function(port) {
  var args = process.argv;
  args.shift();
  args.splice(1, 0, '--daemon');

  out = err = fs.openSync('./nikki.log', 'a');
  
  var child = proc.spawn('node', args, {
    detached: true,
    stdio: ['ignore', out, err]
  });
  child.unref();
  
  blankline();
  console.log('Nikki running on port', port);
}