var argv            = require('yargs').argv;
var config          = require('./config');
var signals         = require('./signals');
var run             = require('./run');
var blankline       = console.log;
var port            = argv.port || config.get('app.port');

process.title = config.get('general.process-name');

/**
 * nikki --stop
 */
if (argv.stop) {
  console.log('shutting down...');
  signals.sendShutdown();
  
  return;
}

/**
 * nikki --status
 */
if (argv.status) {
  signals.status();
  
  return;
}

/**
 * If we get to this point, it means
 * we are gonna run the app.
 */
run();