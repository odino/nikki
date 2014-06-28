/**
 * Representation of the editor
 */
var _           = require('lodash');
var config      = require('./config');
var events      = require('./events');
var utils       = require('./utils');
var tabs        = require('./tabs');
var sessions    = {};
var editor      = ace.edit("file");

/**
 * Default editor configs.
 */
editor.setTheme("ace/theme/" + config.get('editor.theme'));
editor.commands.removeCommand("find")
editor.commands.removeCommand("replace")
editor.renderer.setPadding(10)
editor.setHighlightActiveLine(false);
editor.setShowPrintMargin(false);
editor.getSession().setUseWorker(false);
editor.setFontSize(config.get('editor.font-size'));

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

/**
 * Sets the default formatting options
 * for the current session.
 */
var setFormatting = function() {
    editor.getSession().setTabSize(getIndentation().quantity);
    editor.getSession().setUseSoftTabs(getIndentation().unit === 'spaces' || getIndentation().unit === 'space' || false);
};

/**
 * Sets the current active editor session.
 *
 * @param resource
 */
var setSession = function(resource) {
    var sessionName = resource.path;

    if (_.has(sessions, sessionName)) {
        tabs.select(resource);
        editor.setSession(sessions[sessionName]);
    } else {
        tabs.add(resource);
        editor.setSession(ace.createEditSession(resource.data));
        editor.getSession().setMode("ace/mode/" + utils.guessLanguage(resource.name));
        sessions[sessionName] = editor.getSession();
    }
}

/**
 * Focus on the editor
 */
events.on('state.focus.tab', function(state){
    editor.focus();
});

module.exports = {
    sessions: {},
    getValue: function() {
        return editor.getValue();
    },
    openFile: function(resource) {
        setSession(resource);
        setFormatting();
        editor.focus();
        editor.gotoLine(0)
    }
};