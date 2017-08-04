var $ = require('../vendor/jquery.js');
var scrollTo = require('../modules/scrollTo.js');

var scrollTop, position, height;

module.exports =  {
    init: function() {
        this.populateTimeline();
        this.bindings();
        this.getDimensions();
    },

    bindings: function() {
        $('.mapped-timeline__entry').click(function(e) {
            e.preventDefault();
            scrollTo.scrollTo(e.currentTarget.hash);
        }.bind(this));

        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));

        $(window).resize(function() {
            this.getPositon();
        }.bind(this));
    },

    populateTimeline: function() {
        $('.mapped-event__event').each(function(i, el) {
            var date = $(el).find('.mapped-event__date').text();
            var title = $(el).find('.mapped-event__title').text();
            var id = $(el).attr('id')

            $('.mapped-timeline__inner').append('<a href=\'#' + id + '\' class=\'mapped-timeline__entry\'>' + date + '<span>' + title + '</span></a>');
        }.bind(this));
    },

    onScroll: function() {
        scrollTop = $(window).scrollTop();

        if (scrollTop - height > position) {
            $('.mapped').addClass('is-fixed');
            $('.mapped-header').attr('style', 'padding-bottom: ' + height + 'px')
        } else {
            $('.mapped').removeClass('is-fixed');
            $('.mapped-header').attr('style', '');
        }
    },

    getDimensions: function() {
        $('.mapped-timeline').removeClass('is-fixed');
        position = $('.mapped-timeline').position().top;
        height = $('.mapped-timeline').height();

        this.onScroll();
    }
};
