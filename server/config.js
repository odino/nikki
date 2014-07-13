/**
 * Configuration module.
 *
 * We will load nikki's default configuration
 * and merge it with the user-defined configuration.
 *
 * @type {*}
 */
var _             = require('lodash');
var fs            = require('fs');
var yaml          = require('js-yaml');
var reconfig      = require('reconfig');
var p             = require('path');
var debug         = require('debug')('nikki:config');
var utils         = require('./utils');
var configuration = {
    paths:  [
        p.join(__dirname, '..'),
        p.join(utils.getUserHomeDir()),
        p.join(process.cwd())
    ]
};

var config = new reconfig(configuration);

config.reload = function() {
  _.forEach(config.get('paths'), function(path){
    try {
      var filePath  = p.join(path, '.nikki.yml');
      config.config = _.merge(config.config, yaml.safeLoad(fs.readFileSync(filePath, 'utf8')));
      debug('Loaded config in ', filePath)
    } catch (err) {
      debug('Warning while loading the config ', err)
    };
  });
};

config.reload();

module.exports = config;