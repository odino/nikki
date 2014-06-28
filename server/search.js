/**
 * Utility module used to execute
 * filesystem searches.
 * 
 * @type {*}
 */
var p       = require('path');
var dir     = require('node-dir');
var config  = require('./config');

var search = {};

/**
 * Returns a regex used for file search,
 * from the given text.
 *
 * We are gonna match exact words as long
 * as they're not separated by a space, which
 * means that matching the file `my_file.txt`
 * will give the following results:
 *
 * my: true
 * my fi: true
 * my dir: false
 *
 * @param text
 * @returns {*}
 */
search.getRegex = function(text) {
    var regexString = '';

    text.split(' ').forEach(function(word){
        word = word.trim();

        if (word) {
            regexString += "(.*)(" + word + ")"
        }
    });

    return RegExp(regexString, "ig");
}

/**
 * Executes a file search on the filesystem,
 * given the search options, and emits an
 * event to notify that a file has been
 * matched.
 *
 * @param options
 * @param socket
 */
search.findFiles = function(options, socket) {
    var ignoreDirs  = new RegExp(config.get('search.exclude').join('|'), 'g');

    dir.readFiles(options.root.path, {match: search.getRegex(options.text), excludeDir: ignoreDirs}, function(err, content, filename, next) {
        if (err) throw err;
        var resource = {path: filename, type: 'file', name: p.basename(filename)};

        socket.emit('search.result', resource)
        next();
    });
}

module.exports = search;