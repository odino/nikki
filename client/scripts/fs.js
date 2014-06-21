var _           = require('lodash');
var keyboard    = require('./keyboard');

var buildTitle = function(path) {
    var title       = $('<h2>')
    var segments    = [];

    _.each(path.split('/').splice(1), function(directory){
        var segment = $('<a>');
        segment.text('/' + directory);
        segments.push(directory);
        segment.attr('href', '/' + segments.join('/'));

        title.append(segment);
    });

    $('#subject').html('').append(title);
}

module.exports = function(socket) {
    socket.on('fs.root', function (fs) {
        buildTitle(fs.root.path)
        var filesystem = $('<ul>')
        $('#fs').html('').append(filesystem);
        history.pushState(null, null, fs.root.path);

        _.each(fs.resources, function(resource){
            var res = $('<li>')
            res.addClass(resource.type);
            res.addClass('resource');
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

            filesystem.append(res)
        })

        $('[id="' + fs.root.path + '"]').addClass('active');
    });
}