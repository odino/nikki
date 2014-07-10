/**
 * This module keeps track of the state
 * of the IDE.
 *
 * @type {{openFile: null}}
 */
var events  = require('./events');

/**
 * Represents nikki's current state.
 */
var state   = {
  /**
   * Currently open file.
   */
  openFile: null,
  /**
   * Focus of the editor.
   */
  focus:    'fs',
  /**
   * Switches the focus and triggers
   * some events so that components
   * can bind focus change on their own.
   */
  switchFocus: function(focus) {
    if (this.focus === focus) {
      return;
    }
    
    events.dispatch('state.focus.change', {
      prev: this.focus,
      next: focus
    });
    events.dispatch('state.focus.' + focus, this);

    this.focus = focus;
  }
}

/**
 * Whenever a file is opened, we'll track it
 * here as the "open file".
 */
events.on('resource.opened', function(resource){
  state.openFile = resource;
});

/**
 * Exports (You don't say?!).
 */
module.exports = state;