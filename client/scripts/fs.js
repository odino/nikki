var _           = require('lodash');
var keyboard    = require('./keyboard');

module.exports = function(socket) {
    socket.on('fs.root', function (resources) {
        var fs      = $('<ul>')
        var title   = $('<h2>')
        title.text(window.location.pathname)

        $('#subject').append(title);
        $('#fs').append(fs);

        _.each(resources, function(resource){
            var res = $('<li>')
            res.addClass(resource.type);
            res.addClass('resource');
            res.attr('id', resource.path);
            res.text(resource.name);
            res.attr('data-resource', JSON.stringify(resource))
            res.click(function(){
                socket.emit('resource.open', resource)
            });

            fs.append(res)
        })

        $('[id="' + resources[0].path + '"]').addClass('active');
    });
}