var state       = require('./state');
var ui          = require('./ui');
var resources   = ui.resources;
var bar         = ui.bar;

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
    executeSearch: function() {
        if (bar().text()) {
            var regex = search.getSearchRegex();

            resources().filter(function(){
                return !$(this).text().match(regex);
            }).hide();

            resources().filter(function(){
                return $(this).text().match(regex);
            }).show();
        } else {
            resources().show();
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
        resources().show();
        state.switchFocus('fs');
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

        var placeHolder = global ? 'Search files...' : 'Search files in the current directory...'

        bar().attr('data-ph', placeHolder);
        bar().show();
        bar().focus();

        bar().keyup(function(){
            search.executeSearch();
        });

        bar().keypress(function(e){
            search.executeSearch();

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