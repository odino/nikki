/**
 * Configuration module.
 *
 * We will load nikki's default configuration
 * and merge it with the user-defined configuration.
 *
 * @type {*}
 */
var fs          = require('fs');
var yaml        = require('js-yaml');
var reconfig    = require('reconfig');
var path        = require('path');

/**
 * Load the default configuration
 */
var configuration   = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(),  '.nikki.yml'), 'utf8'));
var config          = new reconfig(configuration);

module.exports = config