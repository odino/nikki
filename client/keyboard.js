var history = require('./history');
var state = require('./state');

module.exports = function(socket) {
    KeyboardJS.on('tab', function() {
        document.execCommand('insertHTML', false, "&#9;");
        return false;
    });

    KeyboardJS.on('ctrl + s', function() {
        state.openFile.data = $('[id="file-' + state.openFile.path + '"]').text();
        socket.emit('resource.save', state.openFile);
        return false;
    });

    KeyboardJS.on('ctrl + q', function() {
        Prism.highlightAll();
    });

    KeyboardJS.on(';,enter,tab,",\',backspace,del', function() {
        history.past.push($('[id="file-' + state.openFile.path + '"]').text());
    });

    KeyboardJS.on('ctrl + z', function() {
        if (history.past.length) {
            history.future.push($('[id="file-' + state.openFile.path + '"]').text());
            $('[id="file-' + state.openFile.path + '"]').text(history.past.pop());
        }
        return false;
    });

    KeyboardJS.on('ctrl + shift + z', function() {
        if (history.future.length) {
            history.past.push($('[id="file-' + state.openFile.path + '"]').text());
            $('[id="file-' + state.openFile.path + '"]').text(history.future.pop());
        }
        return false;
    });
}