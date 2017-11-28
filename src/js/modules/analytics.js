var $ = require('../vendor/jquery.js');

module.exports =  {
    init: function() {
        // nothing to init
    },

    trackQuestion: function(question, source) {
        if (window.ga) {
            var gaTracker = window.guardian.config.googleAnalytics.trackers.editorial;

            window.ga(gaTracker + '.send', 'event', 'Click', 'in page', 'trump-question-opened | ' + question + ' | ' + source, 1, {
                nonInteraction: true
            });
        }
    }
};
