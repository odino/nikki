var events          = require('./events');
var utils           = require('./utils');
var state           = require('./state');
var editor          = require('./editor');

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
        $('#file').attr('filename', resource.path);
        editor.setSession(ace.createEditSession(resource.data));
        editor.getSession().setMode("ace/mode/" + utils.guessLanguage(resource.name));
        editor.setFormatting();
        editor.focus();
        editor.gotoLine(0)
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
    }
};

events.on('resource.opened', function(resource){
    $('.resource.open').removeClass('open');
    $('.resource.active').addClass('open');
    $('#subject span').remove();
    $('#subject h2').html($('#subject h2').html() + '<span class="highlight">/' + resource.name + '</span>');
    state.switchFocus('tab');
    ui.openFile(resource);
});

module.exports = ui;