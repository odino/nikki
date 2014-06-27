/**
 * Representation of the editor
 */
var config  = require('./config');
var events  = require('./events');
var _       = require('lodash');

/**
 * Get the indentation from the configuration.
 */
var getIndentation = function() {
    var indentation = editor.nikkiConfig.get('editor.indentation').split(' ');

    return {
       quantity: indentation[0],
       unit: indentation[1]
    };
}

var editor = ace.edit("file");

editor.commands.removeCommand("find")
editor.commands.removeCommand("replace")
editor.setTheme("ace/theme/cobalt");
editor.setHighlightActiveLine(false);
editor.setShowPrintMargin(false);
editor.getSession().setUseWorker(false);

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

/**
 * Import the global config
 */
events.on('config', function(config){
    editor.nikkiConfig = config;
});

module.exports = editor;