var state       = require('./state');
var socket      = require('./socket');
var ui          = require('./ui');
var fs          = require('./fs');
var config      = require('./config');
var resources   = ui.resources;
var bar         = ui.bar;

socket.on('search.result', function(resource){
    fs.addResource(resource, null);
});

/**
 * Search object.
 *
 * @type {{executeSearch: executeSearch, toggle: toggle, getSearchRegex: getSearchRegex, reset: reset, show: show, isOpen: isOpen}}
 */
var search = {
    /**
     * Executes a search and hides elements
     * which are not matching it.
     */
    executeSearch: function(text) {
        if (text) {
            $('#fs .resource').remove();
            socket.emit('search', {text: text, root: fs.getStructure().root});
        } else {
            fs.reset();
        };
    },
    /**
     * Toggles the search box.
     */
    toggle: function(global) {
        global = global || false;

        if (search.isOpen()) {
            search.hide();
        } else {
            search.show(global);
        }
    },
    /**
     * Returns the regex used for the search.
     *
     * @returns {RegExp}
     */
    getSearchRegex: function() {
        var regexString = '';

        bar().text().split('').forEach(function(letter){
            letter = letter.trim();
            if (letter) {
                regexString += "(.*)(" + letter + ")"
            }
        });

        return new RegExp(regexString, "i");
    },
    /**
     * Hides the search box.
     */
    hide: function() {
        bar().hide();
        bar().removeClass();
        bar().empty();
        bar().unbind();
        state.switchFocus('fs');
        fs.reset();
    },
    /**
     * Shows the search box.
     */
    show: function(global) {
        bar().empty();
        state.switchFocus('bar');

        bar().finish();
        bar().removeClass();
        bar().addClass('message-search');
        bar().attr('contenteditable', 'true');

        bar().attr('data-ph', 'Search files... (looking in ' + fs.getStructure().root.path + ')');
        bar().show();
        bar().focus();

        bar().on('keyup', function () {
            var searchValue = $(this).text();

            setTimeout(function(){
                if(searchValue == bar().text()) {
                    search.executeSearch(searchValue)
                };
            }, config.get('search.timeout'));
        });

        /**
         * Do not allow pressing 'enter'.
         */
        bar().keypress(function(e){
            return e.which != 13;
        });
    },
    /**
     * Checks whether the search box is open.
     *
     * @returns {*}
     */
    isOpen: function() {
        return bar().hasClass('message-search');
    }
};

module.exports = search;