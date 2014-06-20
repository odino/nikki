var flash = function(message, type) {
    var bar         = $('#bar');
    var messageType = 'message-' + type;

    bar.finish();
    bar.removeClass();
    bar.addClass(messageType)
    bar.text(message);
    bar.fadeIn(200).delay(3000).fadeOut('slow');
}

module.exports = {
    info: function(message) {
        flash(message, 'info');
    },
    alert: function(message) {
        flash(message, 'alert');
    }
};