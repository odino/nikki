var path    = require('path');

var languageGuesserMap = {
    json:       'json',
    markdown:   'markdown',
    md:         'markdown',
    yml:        'yaml',
    js:         'javascript',
    coffee:     'coffescript',
    html:       'html',
    rb:         'ruby',
    php:        'php',
    sql:        'sql',
    py:         'python',
    java:       'java',
    css:        'css',
    scss:       'scss',
    c:          'c',
    xml:        'xml'
}

module.exports = {
    guessLanguage: function(filename) {
        var extension = path.extname(filename).substring(1);

        if (languageGuesserMap[extension]) {
            return languageGuesserMap[extension];
        }

        return 'text';
    }
}