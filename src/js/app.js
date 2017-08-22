var injectHtml = require('./modules/injectHtml.js');
var share = require('./modules/share.js');

setTimeout(function() {
    injectHtml.init()
}, 2000);
share.init();