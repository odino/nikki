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
        state.switchFocus('tab');
        $('#file').attr('filename', resource.path);
        editor.openFile(resource);
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
    ui.openFile(resource);
});

module.exports = ui;