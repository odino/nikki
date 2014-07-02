/**
 * A wrapper for the editor tabs.
 *
 * @type {exports}
 */
var socket  = require('./socket');
var events  = require('./events');
var tabs    = {};

/**
 * Closes the active tab, putting the focus
 * to the one on the left or, if it doesnt
 * exist, the one on the right.
 */
tabs.closeActive = function() {
  var activeTab = $('.tab.active');
  
  if (activeTab.length) {
      events.dispatch('tabs.close', JSON.parse(activeTab.attr('resource')));
      tabs.moveLeft() || tabs.moveRight();
      activeTab.remove();
  }
}

/**
 * Adds a new tab in the editor, setting it as active.
 *
 * @param resource
 */
tabs.add = function(resource) {
    var tab = $('<li data-toggle="tooltip" data-placement="top" title="' + resource.path + '" class="active tab">');
    tab.attr('resource', JSON.stringify(resource));
    tab.attr('resource-path', resource.path);
    tab.tooltip();

    var a = $('<a>');
    a.text(resource.name);
    tab.html(a);

    tab.click(function(){
        socket.emit('resource.open', resource);
    });

    $('.tab').removeClass('active');
    $('.tabs').append(tab);
};

/**
 * Selects the open tab that represents the given
 * resource.
 *
 * @param resource
 */
tabs.select = function(resource) {
    $('.tab').removeClass('active');
    $('.tab[resource-path="' + resource.path + '"]').addClass('active');
};

/**
 * Move to another tab in the specified
 * direction.
 *
 * @param direction
 */
tabs.move = function(direction) {
    var activeTab   = $('.tab.active');
    var element = activeTab[direction]('.tab[resource-path]');

    if (element.length) {
        activeTab.removeClass('active');
        element.addClass('active');
        events.dispatch('resource.opened', JSON.parse(element.attr('resource')));
        
        return true;
    };
    
    return false;
}

/**
 * Moves to the tab on the left.
 *
 * @returns {*}
 */
tabs.moveLeft = function() {
    return tabs.move('prev');
}

/**
 * Moves to the tab on the right.
 *
 * @returns {*}
 */
tabs.moveRight = function() {
    return tabs.move('next');
}

module.exports = tabs;