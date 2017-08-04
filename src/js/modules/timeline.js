var $ = require('../vendor/jquery.js');

var scrollTo = require('../modules/scrollTo.js');

module.exports =  {
    init: function() {
        this.populateTimeline();
        this.bindings();
    },

    bindings: function() {
        $('.mapped-timeline__entry').click(function(e) {
            e.preventDefault();
            scrollTo.scrollTo(e.currentTarget.hash);
        }.bind(this));
    },

    populateTimeline: function() {
        $('.mapped-event__event').each(function(i, el) {
            var date = $(el).find('.mapped-event__date').text();
            var title = $(el).find('.mapped-event__title').text();
            var id = $(el).attr('id')

            $('.mapped-timeline__inner').append('<a href=\'#' + id + '\' class=\'mapped-timeline__entry\'>' + date + '<span>' + title + '</span></a>');
        }.bind(this));
    }
};
