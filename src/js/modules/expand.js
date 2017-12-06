var $ = require('../vendor/jquery.js');
window.handlebars = require('handlebars');

var questionHtml = require('../templates/question.html');

module.exports =  {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.mapped-header__expand').one('click', function() {
            this.expandIndex();
            this.injectHtml();
        }.bind(this));
    },

    expandIndex: function() {
        $('.mapped-header__index').removeClass('is-collapsed').addClass('is-expanded');
    },

    injectHtml: function() {
        var questionTemplate = handlebars.compile(questionHtml);

        for (var i in data.Questions) {
            if (!data.Questions[i].isLatest && data.Questions[i].group !== 'Top level' && data.Questions[i].group !== 'The Analysis') {
                var target = '.mapped-header__index .mapped-header__questions--' + this.handelise(data.Questions[i].group);

                if ($(target).length === 0) {
                    $('.mapped-header__index').append('<div class=\'mapped-header__questions mapped-header__questions--' + this.handelise(data.Questions[i].group) + '\'><h1 class=\'mapped-header__question-title\'>' + data.Questions[i].group + '</h1></div>');
                    $(target).after('<img class=\'mapped-header__divider\' src=\'@@assetPath@@/assets/images/divider.svg\' />');
                }

                $(target).append(questionTemplate(data.Questions[i]));
            }
        }
    },

    handelise: function(string) {
        return string.replace(/ /g, '-').replace('?', '').replace(/&/, 'and').replace(/'/g, '').replace(':', '').replace('/', '').toLowerCase();
    }
};