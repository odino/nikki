/**
 * Utility module used to execute
 * filesystem searches.
 * 
 * @type {*}
 */
var p       = require('path');
var _       = require('lodash');
var fs      = require('fs');
var debug   = require('debug')('nikki:search');
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
};

/**
 * Executes a file search on the filesystem,
 * given the search options, and emits an
 * event to notify that a file has been
 * matched.
 *
 * @param options
 * @param socket
 */
search.find = function(options, socket) {
  var notifyResult = function(resource){
      socket.emit('search.result', resource)
      debug('search result ', resource);
  };
  
  var finder = require('findit')(options.root.path);
  
  finder.on('directory', function (dir, stat, stop) {
    var base = p.basename(dir);

    if (_.contains(config.get('search.exclude'), base)) {
      stop();
    } else {
      if (dir.match(search.getRegex(options.text))) {
        notifyResult({
          path: dir,
          type: 'directory',
          name: base,
          parent: p.dirname(dir)
        });
      }
    }
  });
  
  finder.on('file', function (file, stat) {
    if (file.match(search.getRegex(options.text))) {
      notifyResult({
        path: file,
        type: 'file',
        name: p.basename(file),
        parent: p.dirname(file)
      });
    }
  });
};

module.exports = search;