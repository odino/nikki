#!/usr/bin/env node
'use strict';

var path    = require('path');
var fs      = require('fs');
var argv    = require('yargs').argv;
var yaml    = require('js-yaml');

var nikki  = require(path.join(__dirname, '..', 'package.json'));
var config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', '.nikki.yml'), 'utf8'));

console.log("Nikki v" + nikki.version);

if (argv.version) {
    return;
}

if (argv.help) {
    console.log();
    console.log('=== ' + nikki.description + ' ===');
    console.log();
    console.log(' * homepage: ' + nikki.homepage);
    console.log(' * repository: ' + nikki.repository.url);
    console.log(' * bugs: ' + nikki.bugs.url);
    console.log();
    console.log(" To start the IDE, simply run the `nikki` command.");
    console.log();
    console.log(' Options:');
    console.log();
    console.log('    --host       defines on which host we will run (default: ' + config.app.host + ')');
    console.log('    --port       defines on which port we will run (default: ' + config.app.port + ')');
    console.log('    --no-open    do not open the browser after booting');
    console.log();
    console.log(' Examples:');
    console.log();
    console.log('    $ nikki --no-open');
    console.log('    $ nikki --port 8000');
    console.log('    $ nikki --host nikki.local --port 8000 --no-open');
    console.log();
    console.log('Proudly crafted by ' + nikki.author.name + ' and released under the ' + nikki.license + ' license');
    console.log('Feel free to reach out at ' + nikki.author.email);

    return;
}

require('./../server/index')