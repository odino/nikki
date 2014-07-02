var path    = require('path');
var config  = require('./config');

module.exports = {
    guessLanguage: function(filename) {
        var extension = path.extname(filename).substring(1);

        return config.get('editor.extensions')[extension] || 'text';
    }
}