#!/usr/bin/env node
'use strict';

var argv = require('yargs').argv

var config = require('./../package.json');
console.log("Nikki v" + config.version);

if (argv.version) {
    return;
}

if (argv.help) {
    console.log();
    console.log('=== ' + config.description + ' ===');
    console.log();
    console.log(' * homepage: ' + config.homepage);
    console.log(' * repository: ' + config.repository.url);
    console.log(' * bugs: ' + config.bugs.url);
    console.log();
    console.log("To start the IDE, simply run the `nikki` command.");
    console.log();
    console.log('Proudly crafted by ' + config.author.name + ' and released under the ' + config.license + ' license');
    console.log('Feel free to reach out at ' + config.author.email);

    return;
}

require('./../server/index')