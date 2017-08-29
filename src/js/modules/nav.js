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

        if (scrollTop > position) {
            this.fixNav();
        } else {
            this.unFixNav();
        }

        this.hightlightCurrentSection();
    },

    getDimensions: function() {
        this.unFixNav();

        position = $('.mapped-nav').offset().top;
        height = $('.mapped-nav').height();
        events = {};

        $('.mapped-section').each(function(i, el) {
            events[$(el).attr('id')] = $(el).offset().top;
        }.bind(this));

        this.onScroll();
    },

    hightlightCurrentSection: function() {
        $('.mapped-nav__entry').removeClass('is-current');

        var scrollTo = 0;

        for (var i in events) {
            if (scrollTop + height + 40 > events[i]) {
                $('.mapped-nav__entry').removeClass('is-current');
                $('.mapped-nav__entry[href="#' + i + '"]').addClass('is-current');
                scrollTo = $('.mapped-nav__entry.is-current').position().left - 10;
            }
        }

        $('.mapped-nav .gs-container').stop().animate({
            scrollLeft: scrollTo
        }, 100);

    },

    fixNav: function() {
        $('.mapped').addClass('is-fixed');
        $('.mapped-header').attr('style', 'padding-bottom: ' + height + 'px');
    },

    unFixNav: function() {
        $('.mapped').removeClass('is-fixed');
        $('.mapped-header').attr('style', '');
    }
};
