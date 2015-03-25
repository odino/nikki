/**
 * Handling socket events.
 *
 * @type {*}
 */
var fs          = require('fs');
var fse         = require('fs-extra');
var _           = require('lodash');
var p           = require('path');
var debug       = require('debug')('nikki:socket');
var config      = require('./config');
var utils       = require('./utils');
var search      = require('./search');

var sanitizePath = function(path) {
    return path.replace('~', utils.getUserHomeDir()).replace('//', '/');
}

module.exports = {
    watcher: null,
    startTheFun: function(app) {
        var self = this;
        var io   = require('socket.io')(app);

        io.on('connection', function (socket) {
            debug('connected');
            socket.on('readyOn', function(path){
                debug('client is ready on ', path);
                path = sanitizePath(path);

                config.config.paths.push(path);
                config.reload();

                socket.emit('config', config.get());

                socket.on('search.find', function (options) {
                    debug('client searching', options);
                    search.find(options, socket);
                });
                
                socket.on('search.grep', function (options) {
                    debug('client grepping', options);
                    search.grep(options, socket);
                });
                
                socket.on('resource.delete', function (resource) {
                    debug('deleting resource', resource);
                    fse.remove(resource.path, function(err){
                      if (err) throw err;
                    
                      socket.emit('resource.deleted', resource);
                      self.openDir({path: resource.parent}, socket);
                    });
                });

                socket.on('boot', function (resource) {
                    self.openDir(resource, socket, function(){
                      socket.emit('boot.done');
                    });
                });

                socket.on('resource.open', function(resource){
                    debug('opening resource: ', resource);
                    
                    if (resource.type === 'file') {
                        fs.readFile(resource.path, 'utf-8', function(err, data){
                            if (err && err.code === 'ENOENT') {
                              message = "File {f} does not exist, was probably deleted outside of nikki";
                              socket.emit('server.alert', message.replace('{f}', err.path));
                              return;
                            }
                            
                            resource.data = data;
                            socket.emit('resource.opened', resource);
                        });
                    } else {
                        self.openDir(resource, socket)
                    }
                });

                socket.on('resource.save', function(resource){
                    fs.writeFile(resource.path, resource.data, function(err) {
                        if (err) {
                            var message = "Unable to save file {f} -- do you have permissions to write to it? (error code: {c})".replace('{f}', resource.path).replace('{c}', err.code);

                            socket.emit('server.error', message);

                            return;
                        };
                        socket.emit('resource.saved', resource);
                    });
                    debug('saved resource ', resource);
                });
            });
        });
    },
    openDir: function(resource, socket, callback) {
        var self  = this;
        debug('opening dir ', resource);
        resource.path = sanitizePath(resource.path);

        fs.readdir(resource.path, function (err, files) {
            if (err && err.code === 'ENOENT') {
              socket.emit('server.error', "Directory {dir} does not exist".replace('{dir}', err.path));
              return;
            }
          
            resources = [];

            _.each(files, function(file){
                var path = p.join(resource.path, file);
                
                try {
                  resources.push({
                      type:   fs.lstatSync(path).isDirectory() ? 'directory' : 'file',
                      name:   file,
                      parent: resource.path,
                      path:   path
                  });
                } catch (err) {
                  socket.emit('server.error', "An error occurred doing a stat of {path}".replace('{path}', path));
                }
            });

            var resources = _.filter(_.sortBy(resources, function(resource) {
                return resource.type + resource.name;
            }), function(resource){
                return !_.contains(config.get('projects.ignore'), resource.name);
            });

            socket.emit('fs.root', {root: resource, resources: resources});
            callback && callback();

            self.watch(resource, function(){
              self.openDir(resource, socket);
            });            
        });
    },
    watch: function(resource, callback) {
      if (!config.get('general.watch')) {
        return;
      }
      
      var self = this;
      
      if (self.watcher) {
        debug('Stopping previously registered fs watcher')
        self.watcher.close();
      }
      
      debug('Watching files and directories in', resource.path)
      self.watcher = fs.watch(resource.path, {}, callback);
    }
}