/**
 * Handling socket events.
 *
 * @type {*}
 */
var fs          = require('fs');
var _           = require('lodash');

module.exports = {
    startTheFun: function(app) {
        var self = this;
        var io   = require('socket.io')(app);

        io.on('connection', function (socket) {
            socket.on('boot', function (resource) {
                self.openDir(resource, socket)
            });

            socket.on('resource.open', function(resource){
                if (resource.type === 'directory') {
                    self.openDir(resource, socket)
                } else {
                    fs.readFile(resource.path, 'utf-8', function(err, data){
                        if (err) throw err;
                        resource.data = data;
                        socket.emit('resource.opened', resource);
                    });
                }
            });

            socket.on('resource.save', function(resource){
                fs.writeFile(resource.path, resource.data, function(err) {
                    if (err) throw err;
                    socket.emit('resource.saved', resource);
                });
            });
        });
    },
    openDir: function(resource, socket) {
        fs.readdir(resource.path, function (err, files) {
            if (err) throw err;
            resources = [];

            _.each(files, function(file){
                var path = resource.path + '/' + file;

                resources.push({
                    type:   fs.lstatSync(path).isDirectory() ? 'directory' : 'file',
                    name:   file,
                    parent: resource.path,
                    path:   path
                });
            });

            var resources = _.sortBy(resources, function(resource) {
                return resource.type + resource.name;
            });

            socket.emit('fs.root', {root: resource, resources: resources});
        });
    }
}