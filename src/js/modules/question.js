var $ = require('../vendor/jquery.js');

var bios = require('../modules/bios.js');
var timeline = require('../modules/timeline.js');
var analytics = require('../modules/analytics.js');

var card = require('../templates/card.html');

var cardTemplate,
    stack = [];

module.exports =  {
    init: function() {
        this.bindings();
        this.compileTemplate();
        this.checkForDeepLink();
    },

    bindings: function() {
        $(window).on('hashchange', function() {
            this.onHashChange();
        }.bind(this));

        $('.mapped-mask, .mapped-close').click(function() {
            this.removeIdFromUrl();
            this.closeQuestions();
        }.bind(this));
    },

    compileTemplate: function() {
        cardTemplate = handlebars.compile(card);
    },

    checkForDeepLink: function() {
        var id = window.location.hash.replace('#', '').split('?')[0];

        if (this.getQuestion(id)) {
            this.openQuestion(id);
        }
    },

    onHashChange: function() {
        var id = window.location.hash.replace('#', '');

        if (!id) {
            this.closeQuestions();
        } else if (id && id !== stack[0]) {
            this.openQuestion(id);
        }
    },

    removeIdFromUrl: function() {
        window.history.pushState({}, 'Trump-Russia investigation: The key questions answered', window.location.pathname);
    },

    openQuestion: function(question) {
        var id = typeof question === 'object' ? $(question).attr('href').replace('#', '') : question;
        var isFromStack = id === stack[1] ? true : false;
        var data = this.getData(id);

        // if user clicks on same question do nothing
        if (id === stack[0]) {
            return false;
        }

        if (isFromStack) {
            stack = stack.slice(stack.indexOf(id), stack.length);
        } else {
            stack.unshift(id);
        }

        if (!$('html').hasClass('is-open')) {
            $('html').addClass('is-open');
        }

        if ($('#' + id).length === 0) {
            $('.mapped').append(cardTemplate(data));
        }

        this.addChart(id);
        this.enhanceTweets(id);
        this.enhanceGraphics(id);
        this.enhancePhotos(id);

        setTimeout(function() {
            this.cycleQuestions();
        }.bind(this), 100);

        this.analytics(id);
        this.scrollCardToTop(id);
        this.updateUrl(data);
    },

    getData: function(id) {
        var question = this.getQuestion(id);

        if (question.relatedQuestion1) {
            question.relatedImage1 = this.getQuestion(this.handelise(question.relatedQuestion1)).image;
        }

        if (question.relatedQuestion2) {
            question.relatedImage2 = this.getQuestion(this.handelise(question.relatedQuestion2)).image;
        }

        if (question.relatedQuestion3) {
            question.relatedImage3 = this.getQuestion(this.handelise(question.relatedQuestion3)).image;
        }

        if (question.relatedQuestion4) {
            question.relatedImage4 = this.getQuestion(this.handelise(question.relatedQuestion4)).image;
        }

        return question;
    },

    getQuestion: function(id) {
        for (var i in data.Questions) {
            if (data.Questions[i].id === id) {
                return data.Questions[i];
            }
        }

        return false;
    },

    closeQuestions: function() {
        $('html').removeClass('is-open');
        $('.mapped-card').addClass('is-closing');

        setTimeout(function() {
            $('.mapped-card').removeClass('is-visible is-visible-1 is-visible-2 is-closing');
        }, 500);

        stack = [];
    },

    updateUrl: function(data) {
        if (window.location.hash !== '#' + data.id) {
            window.location.href = window.location.href.split('#')[0] + '#' + data.id;
            $('title').text(data.question);
        }
    },

    cycleQuestions: function() {
        $('.mapped-card').removeClass('is-visible is-visible-1 is-visible-2');

        for (var i in stack) {
            if (i == 0) {
                $('#' + stack[i]).addClass('is-visible');
            }  else {
                $('#' + stack[i]).addClass('is-visible-' + i);
            }
        }
    },

    addChart: function(id) {
        var type = $('#' + id).attr('data-type');

        if (!$('#' + id).hasClass('has-chart')) {
            if (type === 'bios') {
                bios.create(id);
            }

            if (type === 'timeline') {
                timeline.create(id);
            }
        }

        $('#' + id).addClass('has-chart');
    },

    enhanceTweets: function(id) {
        var tweets = $('#' + id).find('.mapped-tweet').each(function(i, tweet) {
            if (!$(tweet).hasClass('is-enhanced')) {
                var id = $(tweet).data('url');
                $.ajax({
                    url: 'https://publish.twitter.com/oembed?url=https://www.twitter.com' + id,
                    dataType: 'jsonp',
                    success: function(data) {
                       $(tweet).html(data.html);
                       $(tweet).addClass('is-enhanced');
                    }
                });
            }
        });
    },

    enhanceGraphics: function(id) {
        $('#' + id + ' .mapped-card__copy img').each(function(i, img) {
            if (!$(img).hasClass('is-enhanced') && $(img).attr('alt') === 'Graphic') {
                $(img).attr('src', function() { return '@@assetPath@@/assets/images/graphics/' + $(this).attr('src') + '.svg' });
                $(img).addClass('is-enhanced');
            }
        });
    },

    enhancePhotos: function(id) {
        $('#' + id + ' .mapped-card__copy img').each(function(i, img) {
            if (!$(img).hasClass('is-enhanced') && $(img).attr('alt').slice(0, 8) === 'Photo - ') {
                $(img).attr('src', function() { return '@@assetPath@@/assets/images/photos/' + $(this).attr('src') + '.jpg' });
                $(img).addClass('is-enhanced');
                $(img).append
                $(img)[0].outerHTML = '<div class=\'mapped-card__image\'>' + $(img)[0].outerHTML + '<span class=\'mapped-card__caption\'>' + $(img).attr('alt').slice(8) + '</span></div>';
            }
        });
    },

    scrollCardToTop: function(id) {
        $('#' + id).find('.mapped-card__content').scrollTop(0);
    },

    analytics: function(id) {
        var source;

        if ($('.mapped-card').hasClass('is-visible')) {
            source = 'from ' + $('.mapped-card.is-visible').attr('id');
        } else {
            source = 'from index';
        }

        analytics.trackQuestion(id, source);
    },

    handelise: function(string) {
        return string.replace(/ /g, '-').replace('?', '').replace(/'/g, '').replace(':', '').replace('/', '').toLowerCase();
    }
};
