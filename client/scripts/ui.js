var events          = require('./events');
var state           = require('./state');
var editor          = require('./editor');
var fs              = require('./fs');

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
    $('.resource.open').removeClass('open');
    $('.resource.active').addClass('open');
    $('#subject span').remove();
    fs.buildTitle(resource.parent);
    $('#subject #navigation').append('<span class="highlight">/' + resource.name + '</span>');
    $('#file').attr('filename', resource.path);
    editor.openFile(resource);
  },
  /**
   * Returns all the resources.
   *
   * @returns {*|jQuery|HTMLElement}
   */
  preview: function(){
    return $('#preview');
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
  },
  /**
   * Returns the bar.
   *
   * @returns {*|jQuery|HTMLElement}
   */
  focus: function() {
    return $('#focus');
  }
};

var focusIcons = {
  bar: 'fa-search-plus',
  tab: 'fa-pencil-square',
  fs: 'fa-folder-open'
}

/**
 * Add an icon for the initial, default state.
 */
ui.focus().addClass(focusIcons[state.focus]);

/**
 * When the focus changes, update the focus icon
 * on the top-right of the screen.
 */
events.on('state.focus.change', function(state){
  ui.focus().removeClass(focusIcons[state.prev]);
  ui.focus().addClass(focusIcons[state.next]);
});

events.on('resource.opened', function(resource){
  ui.openFile(resource);
});

module.exports = ui;