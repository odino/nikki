/**
 * Handling socket events.
 *
 * @type {*}
 */
var fs          = require('fs');
var path        = require('path');
var _           = require('lodash');

module.exports = {
    startTheFun: function(app) {
        var io          = require('socket.io')(app);

        io.on('connection', function (socket) {
            socket.on('boot', function (data) {
                fs.readdir(data.path, function (err, files) {
                    if (err) throw err;
                    resources = [];

                    _.each(files, function(file){
                        var path = data.path + '/' + file;

                        resources.push({
                            type:   fs.lstatSync(path).isDirectory() ? 'directory' : 'file',
                            name:   file,
                            parent: data.path,
                            path:   path
                        });
                    });

                    socket.emit('fs.root', _.sortBy(resources, function(resource) {
                        return resource.type + resource.name;
                    }));
                });
            });

            socket.on('resource.open', function(resource){
                fs.readFile(resource.path, 'utf-8', function(err, data){
                    if (err) throw err;
                    resource.data = data;
                    socket.emit('resource.opened', resource);
                });
            });

            socket.on('resource.save', function(resource){
                fs.writeFile(resource.path, resource.data, function(err) {
                    if (err) throw err;
                    socket.emit('resource.saved', resource);
                });
            });
        });
    }
}