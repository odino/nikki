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
var codeHighlighter = require('./code-highlighter');

module.exports = function(socket) {
    /**
     * Tab
     */
    keyboard.on('tab', function() {
        document.execCommand('insertHTML', false, "    ");//"&#9;");
        return false;
    });

    /**
     * Save file
     */
    keyboard.on('ctrl + s', function() {
        bar.alert('Saving...');
        state.openFile.data = $('[id="file-' + state.openFile.path + '"]').text();
        socket.emit('resource.save', state.openFile);
        return false;
    });

    /**
     * Highlight code
     */
    keyboard.on('ctrl + q', function() {
        codeHighlighter.run();
    });

    /**
     * Switch focus
     */
    keyboard.on('ctrl + shift + x', function() {
        var focus = 'tab';

        if (state.focus === 'tab') {
            focus = 'fs';
        }

        state.switchFocus(focus);
    });

    /**
     * Undo
     */
    keyboard.on('ctrl + z', function() {
        if (!document.execCommand("undo", "", null)) {
            bar.alert("Nothing to undo");
        }

        return false;
    });

    /**
     * Redo
     */
    keyboard.on('ctrl + shift + z', function() {
        if (!document.execCommand("redo", "", null)) {
            bar.alert("Nothing to redo");
        }

        return false;
    });

    /**
     * Local search
     */
    keyboard.on('ctrl + shift + f', function() {
        search.toggle();

        return false;
    });

    /**
     * Global search
     */
    keyboard.on('ctrl + f', function() {
        search.toggle(true);

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
     * Down selection
     */
    keyboard.on('ctrl + shift + down', function() {
        if (state.focus === 'tab') {
            window.getSelection().modify("extend", "forward", "documentboundary");
        }
    });

    /**
     * Move to the end of a file
     */
    keyboard.on('ctrl + down', function() {
        if (state.focus === 'tab') {
            var code = $('code')[0];
            range = document.createRange();
            range.selectNodeContents(code);
            range.collapse(false);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            $('#file')[0].scrollTop = $('#file')[0].scrollHeight;
        }

        return false;
    });

    /**
     * Move to the beginning of a file
     */
    keyboard.on('ctrl + up', function() {
        if (state.focus === 'tab') {
            var code = $('code')[0];
            range = document.createRange();
            range.selectNodeContents(code);
            range.collapse(true);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            $('#file')[0].scrollTop = 0;
        }

        return false;
    });

    /**
     * Up selection
     */
    keyboard.on('ctrl + shift + up', function() {
        if (state.focus === 'tab') {
            window.getSelection().modify("extend", "backward", "documentboundary");
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
};