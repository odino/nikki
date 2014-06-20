var body    = $('body');
var _       = require('lodash');
var state   = require('./state');
var history = require('./history');

module.exports = function(socket) {
    socket.on('resource.opened', function(resource){
        state.openFile = resource;
        var tab = $('<pre>');
        var code = $('<code class="language-javascript" contenteditable>');
        code.attr('id', 'file-' + resource.path);
        code.text(resource.data);
        tab.html(code);
        body.append(tab);
        history.past.push($('[id="file-' + state.openFile.path + '"]').text());
        Prism.highlightAll();

        $('[contenteditable]').keypress(function(e) {
            if (e.keyCode === 13) {
                document.execCommand('insertHTML', false, "\n");
                return false;
            }
        });
    });
}