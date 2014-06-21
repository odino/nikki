var path    = require('path');

var languageGuesserMap = {
    json: 'javascript',
    js:   'javascript',
    html: 'markup',
    rb:   'ruby',
    php:  'php',
    sql:  'sql',
    py:   'python',
    java: 'java',
    css:  'css',
    scss: 'css',
    c:    'c'
}

module.exports = {
    guessLanguage: function(filename) {
        var extension = path.extname(filename).substring(1);

        if (languageGuesserMap[extension]) {
            return languageGuesserMap[extension];
        }

        return 'vim';
    }
}