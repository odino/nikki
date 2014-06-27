/**
 * Representation of the editor
 */
var _       = require('lodash');
var config  = require('./config');
var events  = require('./events');

/**
 * Get the indentation from the configuration.
 */
var getIndentation = function() {
    var indentation = config.get('editor.indentation').split(' ');

    return {
       quantity: indentation[0],
       unit: indentation[1]
    };
}

var editor = ace.edit("file");

editor.setTheme("ace/theme/" + config.get('editor.theme'));
editor.commands.removeCommand("find")
editor.commands.removeCommand("replace")
editor.renderer.setPadding(10)
editor.setHighlightActiveLine(false);
editor.setShowPrintMargin(false);
editor.getSession().setUseWorker(false);
editor.setFontSize(config.get('editor.font-size'));

/**
 * Sets the default formatting options
 * for the current session.
 */
editor.setFormatting = function() {
    editor.getSession().setTabSize(getIndentation().quantity);
    editor.getSession().setUseSoftTabs(getIndentation().unit === 'spaces' || getIndentation().unit === 'space' || false);
};

/**
 * Focus on the editor
 */
events.on('state.focus.tab', function(state){
    editor.focus();
});

module.exports = editor;