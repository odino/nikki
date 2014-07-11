/**
 * This module simply defines keyboard actions
 * to be performed on certain keyboard shortcuts.
 *
 * @type {exports}
 */
var state           = require('./state');
var config          = require('./config');
var keyboard        = require('./keyboard');
var bar             = require('./bar');
var search          = require('./search');
var editor          = require('./editor');
var socket          = require('./socket');
var tabs            = require('./tabs');
var config          = require('./config');
var ui              = require('./ui');

/**
 * Returns a keybord shortcut given its name.
 */
var shortcut = function(name) {
  var shortcut = config.get('editor.shortcuts.' + name);
  
  if (!shortcut) {
    bar.error("Configuration error: please map the '{s}' shortcut".replace('{s}', name));
  }
  
  return shortcut;
};

/**
 * Delete a file
 */
keyboard.on(shortcut('question_confirm'), function() {
  var question = bar.question();
  
  if (question) {
    var event   = question.attr('event');
    var subject = JSON.parse(question.attr('subject'));
    socket.emit(event, subject);
    bar.hide();
    
    return false;
  }
});

/**
 * Delete a file
 */
keyboard.on(shortcut('question_abort'), function() {
  var question = bar.question();
  
  if (question) {
    bar.hide();
    
    return false;
  }
});

/**
 * Delete a file
 */
keyboard.on(shortcut('file_delete'), function() {
  var activeResource = $('.resource.active');
  
  if (activeResource.length) {
    var resource = JSON.parse(activeResource.attr('data-resource'));
    
    bar.ask('Are you sure you want to delete ' + resource.path + '?', 'resource.delete', resource);
  }

  return false;
});

/**
 * Open in github.
 * 
 * Please note that this feature depends on the configuration.
 */
keyboard.on(shortcut('open_in_github'), function() {
    if (state.openFile && config.get('github.enabled')) {
        var url       = 'https://github.com/';
        var username  = config.get('github.username');
        var parts     = state.openFile.path.replace(config.get('github.path'), '');
        var repo      = parts.split('/')[1];
        var path      = parts.split(repo)[1];
        var url       = url + username + '/' + repo + '/blob/master/' + path + '#L' + editor.getLine();

        window.open(url, '_tab');
    }

    return false;
});

/**
 * Closes a tab.
 */
keyboard.on(shortcut('tab_close'), function() {
    tabs.closeActive();

    return false;
});

/**
 * Moves to the tab on the left.
 */
keyboard.on(shortcut('tab_move_left'), function() {
    tabs.moveLeft();

    return false;
});

/**
 * Moves to the tab on the right.
 */
keyboard.on(shortcut('tab_move_right'), function() {
    tabs.moveRight();

    return false;
});

/**
 * Save file
 */
keyboard.on(shortcut('file_save'), function() {
    if (state.focus === 'tab') {
        bar.alert('Saving...');
        state.openFile.data = editor.getValue();

        socket.emit('resource.save', state.openFile);
    }

    return false;
});

/**
 * Switch focus
 */
keyboard.on(shortcut('focus_switch'), function() {
    var focus = 'tab';

    if (state.focus === 'tab') {
        focus = 'fs';
    }

    state.switchFocus(focus);
});

/**
 * Local search
 */
keyboard.on(shortcut('find'), function() {
    search.toggle();

    return false;
});

/**
 * Local search
 */
keyboard.on(shortcut('grep'), function() {
    search.toggle('grep');

    return false;
});

/**
 * Down arrow
 */
keyboard.on(shortcut('file_move_down'), function() {
    if (state.focus === 'fs') {
        var resource = $('.resource.active');
        var canGoDown = resource.next().hasClass('resource');

        if (canGoDown) {
            resource.removeClass('active');
            resource.next().addClass('active');
        } else {
            bar.alert("Where ya goin?")
        }

        return false;
    }
});

/**
 * Up arrow
 */
keyboard.on(shortcut('file_move_up'), function() {
    if (state.focus === 'fs') {
        var resource = $('.resource.active');
        var canGoDown = resource.prev().hasClass('resource');

        if (canGoDown) {
            resource.removeClass('active');
            resource.prev().addClass('active');
        } else {
            bar.alert("Where ya goin?")
        }

        return false;
    }
});

/**
 * Open files / directories
 */
keyboard.on(shortcut('file_open'), function() {
    if (state.focus === 'fs') {
        var resource = $('.resource.active');

        if (resource) {
            socket.emit('resource.open', JSON.parse(resource.attr('data-resource')))
        }

        return false;
    }
});