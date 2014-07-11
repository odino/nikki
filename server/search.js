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
 * Returns an instance of the finder.
 */
search.getFinder = function(path) {
  return require('findit')(path);
};

/**
 * Notifies the client that we've found
 * something.
 */
search.notifyResult = function(resource, socket) {
  socket.emit('search.result', resource)
  debug('search result ', resource);  
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
  var finder = search.getFinder(options.root.path);
  
  finder.on('directory', function (dir, stat, stop) {
    var base = p.basename(dir);

    if (_.contains(config.get('search.exclude'), base)) {
      stop();
    } else {
      if (dir.match(search.getRegex(options.text))) {
        search.notifyResult({
          path: dir,
          type: 'directory',
          name: base,
          parent: p.dirname(dir)
        }, socket);
      }
    }
  });
  
  finder.on('file', function (file, stat) {
    if (file.match(search.getRegex(options.text))) {
      search.notifyResult({
        path: file,
        type: 'file',
        name: p.basename(file),
        parent: p.dirname(file)
      }, socket);
    }
  });
};

/**
 * Searches for content in files.
 * 
 * We are going go tool through all files
 * in options.root.path and look for the
 * string options.text in them.
 * 
 * In other IDEs, this functionality might
 * be referred as "Find in files".
 */
search.grep = function(options, socket) {
  var finder =  search.getFinder(options.root.path);
  
  finder.on('directory', function (dir, stat, stop) {
    var base = p.basename(dir);

    if (_.contains(config.get('search.exclude'), base)) {
      stop();
    }
  });
  
  finder.on('file', function (file, stat) {
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) {
        console.log(err);
        return;
      }
      
      var matches = data.match(search.getRegex(options.text));
      
      if (matches) {
        search.notifyResult({
          path: file,
          type: 'file',
          name: p.basename(file),
          parent: p.dirname(file),
          misc: matches
        }, socket);
      }
    });
  });
};

module.exports = search;