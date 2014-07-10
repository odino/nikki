/**
 * This module simply defines keyboard actions
 * to be performed on certain keyboard shortcuts.
 *
 * @type {exports}
 */
var state           = require('./state');
var keyboard        = require('./keyboard');
var bar             = require('./bar');
var search          = require('./search');
var editor          = require('./editor');
var socket          = require('./socket');
var tabs            = require('./tabs');
var config          = require('./config');
var ui              = require('./ui');

/**
 * Delete a file
 */
keyboard.on('y', function() {
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
keyboard.on('n', function() {
  var question = bar.question();
  
  if (question) {
    bar.hide();
    
    return false;
  }
});

/**
 * Delete a file
 */
keyboard.on('delete', function() {
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
keyboard.on('ctrl + g, command + g', function() {
    if (state.openFile && config.get('github.enabled')) {
        console.log(config.get())
        var url = 'https://github.com/';
        username = config.get('github.username');
        var parts = state.openFile.path.replace(config.get('github.path'), '');
        var repo = parts.split('/')[1];
        var path = parts.split(repo)[1];
        var url = url + username + '/' + repo + '/blob/master/' + path + '#L' + editor.getLine();

        window.open(url, '_tab');
    }

    return false;
});

/**
 * Closes a tab.
 */
keyboard.on('ctrl + shift + l, command + shift + l', function() {
    tabs.closeActive();

    return false;
});

/**
 * Moves to the tab on the right.
 */
keyboard.on('ctrl + openanglebracket, command + openanglebracket', function() {
    tabs.moveLeft();

    return false;
});

/**
 * Moves to the tab on the left.
 */
keyboard.on('ctrl + closeanglebracket, command + closeanglebracket', function() {
    tabs.moveRight();

    return false;
});

/**
 * Save file
 */
keyboard.on('ctrl + s, command + s', function() {
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
keyboard.on('ctrl + shift + x, command + shift + x', function() {
    var focus = 'tab';

    if (state.focus === 'tab') {
        focus = 'fs';
    }

    state.switchFocus(focus);
});

/**
 * Local search
 */
keyboard.on('ctrl + shift + f, command + shift + f', function() {
    search.toggle();

    return false;
});

/**
 * Down arrow
 */
keyboard.on('down', function() {
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
keyboard.on('up', function() {
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
keyboard.on('space', function() {
    if (state.focus === 'fs') {
        var resource = $('.resource.active');

        if (resource) {
            socket.emit('resource.open', JSON.parse(resource.attr('data-resource')))
        }

        return false;
    }
});