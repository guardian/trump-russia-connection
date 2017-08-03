var $ = require('../vendor/jquery.js');
var lastUpdated = require('../modules/lastUpdated.js');

module.exports = {
    init: function() {
        this.enhanceDates();
    },

    enhanceDates: function() {
        $('.mapped-event__date').each(function(i, el) {
            this.enhanceDate($(el));
        }.bind(this));
    },

    enhanceDate: function(el) {
        var date = new Date($(el).text());

        $(el).text(date.getDate() + ' ' + lastUpdated.getMonth(date) + ' ' + date.getFullYear());
    }
}