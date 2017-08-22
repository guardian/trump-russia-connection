var $ = require('../vendor/jquery.js');
var scrollTo = require('../modules/scrollTo.js');

var scrollTop, position, height, events;

module.exports =  {
    init: function() {
        this.populateTimeline();
        this.bindings();
        this.getDimensions();

        $(document).ready(function() {
            this.getDimensions();
        }.bind(this));
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
            this.getDimensions();
            this.onScroll();
        }.bind(this));
    },

    populateTimeline: function() {
        $('.mapped-event__event').each(function(i, el) {
            var date = $(el).find('.mapped-event__number').text();
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

        this.hightlightCurrentSection();
    },

    getDimensions: function() {
        $('.mapped').removeClass('is-fixed');
        position = $('.mapped-timeline').position().top;
        height = $('.mapped-timeline').height();
        events = {};

        $('.mapped-event__event').each(function(i, el) {
            events[$(el).attr('id')] = $(el).offset().top;
        }.bind(this));

        this.onScroll();
    },

    hightlightCurrentSection: function() {
        $('.mapped-timeline__entry').removeClass('is-current');

        for (var i in events) {
            if (scrollTop + height > events[i]) {
                $('.mapped-timeline__entry').removeClass('is-current');
                $('.mapped-timeline__entry[href="#' + i + '"]').addClass('is-current');
            }
        }
    }
};
