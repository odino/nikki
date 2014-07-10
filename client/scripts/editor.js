/**
 * Representation of the editor
 */
var _           = require('lodash');
var config      = require('./config');
var events      = require('./events');
var utils       = require('./utils');
var tabs        = require('./tabs');
var state       = require('./state');
var sessions    = {};
var editor      = ace.edit("file");

/**
 * Default editor configs.
 */
editor.setTheme("ace/theme/" + config.get('editor.theme'));
editor.commands.removeCommand("find");
editor.commands.removeCommand("replace");
editor.commands.removeCommand("expandtoline");
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
  var session;
  var sessionName = resource.path;
  saveCurrentSession(resource);

  if (_.has(sessions, sessionName)) {
    session = reopenSession(sessionName, resource);
  } else {
    session = createNewSession(sessionName, resource);
  }
  
  sessions.__current = session;
}

/**
 * Reopens an existing editor session.
 */
var reopenSession = function(name, resource) {
  tabs.select(resource);
  var session = sessions[name];

  editor.setSession(session.session);
  editor.gotoLine(session.cursor.row + 1, session.cursor.column + 1);
  
  return session;
};

/**
 * Creates a new editor session.
 */
var createNewSession = function(name, resource) {
  tabs.add(resource);
  editor.setSession(ace.createEditSession(resource.data));
  editor.getSession().setMode("ace/mode/" + utils.guessLanguage(resource.name));
  var session = {
    session: editor.getSession(),
    cursor: editor.getSelection().getCursor(),
    name: name
  };
  
  sessions[name] = session;
  
  return session;
}

/**
 * Saves the latest state of the current session.
 * 
 * Used to remember the position of the cursor in
 * this session.
 */
var saveCurrentSession = function() {
  var session = editor.getSession();
  
  if (session && sessions.__current) {
    sessions[sessions.__current.name].cursor = editor.getSelection().getCursor();
  }
}

/**
 * Whenever the editor will be focused, we
 * will switch the global focus on it.
 */
editor.on('focus', function(){
  state.switchFocus('tab');
});

/**
 * Whenever there is a focus change, we should
 * blur the editor if we are leaving it.
 */
events.on('state.focus.change', function(state){
  if (state.prev === 'tab') {
    editor.blur();
  }
});

/**
 * We're gonna remove the editor's session
 * once a tab is closed.
 */
events.on('tabs.close', function(resource){
  delete sessions[resource.path];
  
  if (!$('.tab[resource]').length) {
    editor.setValue('');
  }
});

/**
 * Wrapped editor.
 */
module.exports = {
  sessions: {},
  getLine: function() {
    return editor.selection.anchor.row;
  },    
  getValue: function() {
    return editor.getValue();
  },
  openFile: function(resource) {
    setSession(resource);
    setFormatting();
    editor.focus();
  }
};