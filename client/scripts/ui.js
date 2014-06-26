var events          = require('./events');
var utils           = require('./utils');
var state           = require('./state');
var codeHighlighter = require('./code-highlighter');

/**
 * UI object.
 *
 * @type {{openFile: openFile, resources: resources, bar: bar}}
 */
var ui = {
    /**
     * Opens a file in the editor tab.
     *
     * @param resource
     */
    openFile: function(resource) {
        var tab     = $('<pre>');
        var code    = $('<code class="language-' + utils.guessLanguage(resource.name) + '" contenteditable>');

        code.attr('id', 'file-' + resource.path);
        code.text(resource.data);
        tab.html(code);

        $('#file').html(tab);
        code.focus();
    },
    /**
     * Returns all the resources.
     *
     * @returns {*|jQuery|HTMLElement}
     */
    resources: function(){
        return $('.resource');
    },
    /**
     * Returns the bar.
     *
     * @returns {*|jQuery|HTMLElement}
     */
    bar: function() {
        return $('#bar');
    }
};

events.on('resource.opened', function(resource){
    $('.resource.open').removeClass('open');
    $('.resource.active').addClass('open');
    $('#subject span').remove();
    $('#subject h2').html($('#subject h2').html() + '<span class="highlight">/' + resource.name + '</span>');
    state.switchFocus('tab');
    ui.openFile(resource);
    codeHighlighter.run();

    /**
     * Fix for entering newlines.
     */
    $('[contenteditable]').keypress(function(e) {
        if (e.keyCode === 13) {
            document.execCommand('insertHTML', false, "\n");
            return false;
        }
    });
});

module.exports = ui;