var _           = require('lodash');
var keyboard    = require('./keyboard');
var socket      = require('./socket');

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
 * Adds a resource to the filesystem.
 *
 * @param resource
 * @param index
 */
var addResource = function(resource, index) {
    var res = $('<li>')
    res.addClass(resource.type);

    var icon = $('<span>')

    if (resource.type === 'directory') {
        icon.addClass("glyphicon glyphicon-book")
    } else {
        icon.addClass("glyphicon glyphicon-list-alt")
    }

    res.addClass('resource');

    if (index === 0) {
        res.addClass('active');
    }

    res.attr('id', resource.path);
    res.text(resource.name);
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
        addResource(resource, index)
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