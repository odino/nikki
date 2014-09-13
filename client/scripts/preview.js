var utils   = require('./utils');
var ui      = require('./ui');
var editor  = require('./editor');
var state   = require('./state');
var bar     = require('./bar');
var preview = {};

/**
 * Generates the preview for the current
 * open file.
 */
var generatePreview = function() {
  var handler = utils.guessLanguage(state.openFile.path);
  
  if (preview.handlers[handler]) {
    return preview.handlers[handler](editor.getValue())
  }
  
  return '<div><p>Extremely sorry but...there is no preview available for ' + handler + ' files</p><br /><img src="/client/images/unfair.gif" /></div>';
};

/**
 * All handlers registered for previewing files.
 * 
 * They expose a function that takes file contents
 * as input and returns HTML as output.
 */
preview.handlers = {
  markdown: function(content) {
    return markdown.toHTML(content);
  }
};

/**
 * Toggles the preview.
 * 
 * #GIF-FTW!
 */
preview.toggle = function(){
  if (state.openFile) {
    var overlay = ui.preview();
    
    if (!overlay.length) {
      overlay = $('<div>');
      overlay.attr('id', 'preview');
      var content = $('<div>');
      content.html(generatePreview());
      
      overlay.html(content);
      $('body').prepend(overlay);
      $('body').addClass('overlayed');
    } else {
      $('body').removeClass('overlayed');
      overlay.remove();
    }
  } else {
    bar.alert('To preview files you must focus on an open editor tab');
  }
};

module.exports = preview;