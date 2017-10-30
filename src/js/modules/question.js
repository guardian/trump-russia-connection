var $ = require('../vendor/jquery.js');

var card = require('../templates/card.html');

var cardTemplate,
    stack = [];

module.exports =  {
    init: function() {
        this.bindings();
        this.compileTemplate();
    },

    bindings: function() {
        $('a.is-question').unbind('click');
        $('a.is-question').bind('click', function(e) {
            e.preventDefault();
            this.openQuestion(e.target);
        }.bind(this));

        $('.mapped-mask').click(function() {
            this.closeQuestions();
        }.bind(this));
    },

    compileTemplate: function() {
        cardTemplate = handlebars.compile(card);
    },

    openQuestion: function(question) {
        var id = $(question).attr('href').replace('#', '');
        var data = this.getData(id);

        stack = stack.filter(function(question){
            return question !== id;
        });

        stack.unshift(id);

        stack = stack.slice(0,3);

        if (!$('body').hasClass('is-open')) {
            $('body').addClass('is-open');
        }

        if ($('#' + id).length === 0) {
            $('.mapped').append(cardTemplate(data));
        }

        setTimeout(function() {
            this.cycleQuestions();
        }.bind(this), 100);

        this.bindings(); // bindings need to be refreshed as new questions have appeared
    },

    getData: function(id) {
        for (var i in data.Questions) {
            if (data.Questions[i].id === id) {
                return data.Questions[i];
            }
        }
    },

    closeQuestions: function() {
        $('body').removeClass('is-open');
        $('.is-visible').removeClass('is-visible');
        $('.is-visible-1').removeClass('is-visible-1');
        $('.is-visible-2').removeClass('is-visible-2');

        stack = [];
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
    }
};
