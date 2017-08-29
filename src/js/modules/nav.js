var $ = require('../vendor/jquery.js');
var scrollTo = require('../modules/scrollTo.js');

var scrollTop, position, height, events;

module.exports =  {
    init: function() {
        this.populateNav();
        this.bindings();
        this.getDimensions();

        $(document).ready(function() {
            this.getDimensions();
        }.bind(this));
    },

    bindings: function() {
        $('.mapped-nav__entry').click(function(e) {
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

    populateNav: function() {
        $('.mapped-section').each(function(i, el) {
            var number = $(el).find('.mapped-section__number').text();
            var title = $(el).find('.mapped-section__title').text();
            var id = $(el).attr('id')

            $('.mapped-nav__inner').append('<a href=\'#' + id + '\' class=\'mapped-nav__entry\'>' + number + '<span>' + title + '</span></a>');
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
        position = $('.mapped-nav').position().top;
        height = $('.mapped-nav').height();
        events = {};

        $('.mapped-section').each(function(i, el) {
            events[$(el).attr('id')] = $(el).offset().top;
        }.bind(this));

        this.onScroll();
    },

    hightlightCurrentSection: function() {
        $('.mapped-nav__entry').removeClass('is-current');

        for (var i in events) {
            if (scrollTop + height > events[i]) {
                $('.mapped-nav__entry').removeClass('is-current');
                $('.mapped-nav__entry[href="#' + i + '"]').addClass('is-current');
            }
        }
    }
};
