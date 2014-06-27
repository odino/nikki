/**
 * Utility module
 *
 * @type {{getUserHomeDir: home}}
 */
module.exports = {
    getUserHomeDir: function() {
        return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    }
}