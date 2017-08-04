var $ = require('../vendor/jquery.js');
var lastUpdated = require('../modules/lastUpdated.js');
var timeline = require('../modules/timeline.js');

module.exports = {
    init: function() {
        this.enhanceDates();
    },

    enhanceDates: function() {
        $('.mapped-event__date').each(function(i, el) {
            this.enhanceDate($(el));
        }.bind(this));

        timeline.init();
    },

    enhanceDate: function(el) {
        var date = new Date($(el).text());

        $(el).text(date.getDate() + ' ' + lastUpdated.getMonth(date) + ' ' + date.getFullYear());
    },
}