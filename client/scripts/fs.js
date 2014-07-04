var _           = require('lodash');
var p           = require('path');
var keyboard    = require('./keyboard');
var socket      = require('./socket');
var state       = require('./state');

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

window.onpopstate = function(event) {
    if (event.state && event.state.root) {
        root        = event.state.root;
        root.from   = 'window.popstate';

        socket.emit('resource.open', root);
    }
}

socket.on('fs.root', function (fs) {
    openDir(fs);
});

module.exports = {
    buildTitle: buildTitle,
    addResource: addResource,
    reset: reset,
    getStructure: getStructure
}