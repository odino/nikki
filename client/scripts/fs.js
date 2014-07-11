var _           = require('lodash');
var p           = require('path');
var keyboard    = require('./keyboard');
var socket      = require('./socket');
var state       = require('./state');

/**
 * Hovering on the filesystem will
 * automatically switch the focus
 * there.
 */
$('#fs').mouseenter(function(){
  state.switchFocus('fs');
  $(this).focus();
});

/**
 * Builds the title of the page.
 *
 * @param path
 */
var buildTitle = function(path) {
    var title       = $('<h2>')
    title.attr('id', 'navigation');

    var segments    = [];

    _.each(path.split('/').splice(1), function(directory){
        var segment = $('<a>');
        segment.addClass('segment');
        segment.text('/' + directory);
        segments.push(directory);
        segment.attr('href', '/' + segments.join('/'));

        title.append(segment);
    });

    $('#subject').html('').append(title);

    $('#navigation .segment').click(function(){
        socket.emit('resource.open', {path: $(this).attr('href')});

        return false;
    });
};

/**
 * Rules that assign some CSS classes to resources
 * based on their (guessed) type.
 */
var iconRules = {
    read: function(resource) {
        if (_.contains(['.md', '.markdown'], p.extname(resource.name))) {
            return "glyphicon fa fa-book fa-1x";
        }
    },
    lock: function(resource) {
        if (resource.type === 'file' && p.extname(resource.name) === '.lock') {
            return "glyphicon fa fa-lock fa-1x";
        }
    },
    html: function(resource) {
        if (resource.type === 'file' && p.extname(resource.name) === '.html') {
            return "glyphicon fa fa-code fa-1x";
        }
    },
    sql: function(resource) {
        if (resource.type === 'file' && p.extname(resource.name) === '.sql') {
            return "glyphicon fa fa-database fa-1x";
        }
    },
    log: function(resource) {
        if (resource.type === 'file' && p.extname(resource.name) === '.log') {
            return "glyphicon fa fa-exclamation-triangle fa-1x";
        }
    },
    coffeescript: function(resource) {
        if (resource.type === 'file' && p.extname(resource.name) === '.coffee') {
            return "glyphicon fa fa-coffee fa-1x";
        }
    },
    nikki: function(resource) {
        if (resource.name === '.nikki.yml') {
            return "glyphicon fa fa-heart fa-1x";
        }
    },
    git: function(resource) {
        if (resource.name.match(/^\.git/)) {
            return "glyphicon fa fa-git fa-1x";
        }
    },
    executable: function(resource) {
        if (resource.type === 'file' && !p.extname(resource.name)) {
            return "glyphicon fa fa-terminal fa-1x";
        }
    },
    dir: function(resource) {
        if (resource.type === 'directory') {
            return "glyphicon fa fa-folder fa-1x";
        }
    },
    file: function(resource) {
        if (resource.type === 'file') {
            return "glyphicon fa fa-file-text-o fa-1x";
        }
    }
};

/**
 * Adds an icon based on the resource.
 */
var iconize = function(icon, resource) {
    var match = false;

    _.forEach(iconRules, function(rule){
        if (!match && rule(resource)) {
            icon.addClass(rule(resource));

            match = true;
        }
    });
};

/**
 * Adds a resource to the filesystem.
 *
 * @param resource
 * @param index
 */
var addResource = function(resource) {
    var res = $('<li>')
    res.addClass(resource.type);

    var icon = $('<span>')

    iconize(icon, resource);

    res.addClass('resource');

    if (!$('.resource.active').length) {
        res.addClass('active');
    }

    res.attr('id', resource.path);
    res.text(resource.name);
    
    if (state.focus === 'bar') {
      var path = $('<p>');
      path.addClass('path')
      path.text(resource.parent);
      
      res.append(path);
      
      if (resource.misc) {
        resource.misc.forEach(function(misc){
          var m = $('<p>');
          m.addClass('misc')
          m.text("> " + misc + "...");
          
          res.append(m);
        });
      }
    }
    
    res.hover(function(){
        $('.resource.active').removeClass('active');
        res.addClass('active');
    });
    res.attr('data-resource', JSON.stringify(resource))
    res.click(function(){
        socket.emit('resource.open', resource)
    });

    res.prepend(icon);

    $('#fs ul').append(res);
}

/**
 * Opens a directory on the filesystem.
 *
 * @param fs
 */
var openDir = function(fs) {
    buildTitle(fs.root.path)
    var filesystem = $('<ul>')
    $('#fs').html('').append(filesystem);
    $('#fs').attr('filesystem', JSON.stringify(fs));

    /**
     * Super-ghetto trick explained!
     * 
     * If we are coming from a popstate we prevent
     * logging the openDir in the history,
     * else we will never be able to really go back
     * as everytime we go back we'd trigger a fs.open
     * event and adding an entry in the history...
     * 
     * Basically we'd go back in history and add a new
     * entry in it, so you really don't go back...
     */
    if (!fs.root.from || fs.root.from !== 'window.popstate') {
        history.pushState(fs, null, fs.root.path);
    }

    _.each(fs.resources, function(resource, index){
        addResource(resource)
    })

    $('[id="' + fs.root.path + '"]').addClass('active');
};

/**
 * Returns the structure of the current
 * filesystem as it was received by the
 * server.
 *
 * @returns {*}
 */
var getStructure = function() {
    return JSON.parse($('#fs').attr('filesystem'))
}

/**
 * Resets the current filesystem.
 */
var reset = function() {
    openDir(getStructure());
}

/**
 * Super-ghetto trick!
 * 
 * Adding the 'from' state to the FS
 * object.
 * 
 * Look for 'window.popstate' to check
 * why we need this.
 */
window.onpopstate = function(event) {
    if (event.state && event.state.root) {
        root        = event.state.root;
        root.from   = 'window.popstate';

        socket.emit('resource.open', root);
    }
}

var moveUp = function() {
  try {
    var path  = JSON.parse($('#fs').attr('filesystem')).root.path;
    var parts = path.split('/');
    parts.pop();
    path      = parts.join('/');

    socket.emit('resource.open', {path: path});
  } catch (err) {}
};

/**
 * Let's open a new filesystem once the
 * server sends the related event.
 */
socket.on('fs.root', function (fs) {
    openDir(fs);
});

module.exports = {
    buildTitle: buildTitle,
    addResource: addResource,
    reset: reset,
    moveUp: moveUp,
    getStructure: getStructure
}