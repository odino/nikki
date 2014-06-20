var body    = $('body');
var _       = require('lodash');

module.exports = function(socket) {
    socket.on('fs.root', function (resources) {
        var root = $('<ul>')
        root.text(window.location.pathname)
        body.append(root);

        _.each(resources, function(resource){
            var res = $('<li>')
            res.addClass(resource.type);
            res.attr('id', resource.path);
            res.text(resource.name);
            res.click(function(){
                socket.emit('resource.open', resource)
            });

            root.append(res)
        })
    });
}