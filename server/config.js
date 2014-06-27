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
var path          = require('path');
var utils         = require('./utils');
var configuration = {
    paths:  [
        path.join(__dirname, '..',  '.nikki.yml'),
        path.join(utils.getUserHomeDir(),  '.nikki.yml'),
        path.join(process.cwd(),  '.nikki.yml')
    ]
};

_.forEach(configuration.paths, function(path){
  try {
    configuration = _.merge(configuration, yaml.safeLoad(fs.readFileSync(path, 'utf8')));
  } catch (err) {};
});

module.exports = new reconfig(configuration);