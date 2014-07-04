var dnode  = require('dnode');
var config = require('./config');
var argv   = require('yargs').argv;
var port   = argv.dport || config.get('daemon.port');

/**
 * Basic signals for running
 * nikki in detached mode.
 */
module.exports = {
  /**
   * Setup the daemon.
   */
  setup: function() {
    var server = dnode({
      shutdown : function () {
          console.log('Received shutdown message...bye!')
          process.exit(0);
      }
    });
    
    server.listen(port);
  },
  /**
   * Send nikki a shutddown message, so
   * that the daemon can stop.
   */
  sendShutdown: function() {
    var d = dnode.connect(port);
        
    d.on('remote', function (remote) {
        remote.shutdown();
        console.log('Nikki has been stopped')
        process.exit(0);
    });      
    
    d.on('error', function (remote) {
        console.log('Nikki was not running');
    });
    
    return;
  },
  /**
   * Is a nikki process running?
   */
  status: function() {
    var d = dnode.connect(port);
        
    d.on('remote', function (remote) {
        console.log('Nikki is running')
        process.exit();
    });      
    
    d.on('error', function (remote) {
        console.log('Nikki is not running');
    });
    
    return;
  }
}