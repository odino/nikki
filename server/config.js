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
    try {
        _.forEach(config.get('paths'), function(path){
            config.config = _.merge(config.config, yaml.safeLoad(fs.readFileSync(p.join(path, '.nikki.yml'), 'utf8')));
        });
    } catch (err) {};
};

config.reload();

module.exports = config;