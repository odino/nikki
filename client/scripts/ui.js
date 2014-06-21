var events  = require('./events');
var utils   = require('./utils');

var ui = {
    openFile: function(resource) {
        var tab     = $('<pre>');
        var code    = $('<code class="language-' + utils.guessLanguage(resource.name) + '" contenteditable>');

        code.attr('id', 'file-' + resource.path);
        code.text(resource.data);
        tab.html(code);

        $('#file').html(tab);
    }
};

events.on('resource.opened', function(resource){
    ui.openFile(resource);
    Prism.highlightAll();

    $('[contenteditable]').keypress(function(e) {
        if (e.keyCode === 13) {
            document.execCommand('insertHTML', false, "\n");
            return false;
        }
    });
});

module.exports = ui;