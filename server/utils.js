/**
 * Utility module
 *
 * @type {{getUserHomeDir: home}}
 */
module.exports = {
    getUserHomeDir: function() {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }
}