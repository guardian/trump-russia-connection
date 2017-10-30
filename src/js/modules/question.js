var $ = require('../vendor/jquery.js');

var card = require('../templates/card.html');

var cardTemplate;

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
        console.log(question);
        // check if question already exists
        var id = $(question).attr('href').replace('#', '');
        var data = this.getData(id);

        if (!$('body').hasClass('is-open')) {
            $('body').addClass('is-open');
        }

        $('.mapped').append(cardTemplate(data));

        this.cycleQuestions();

        setTimeout(function() {
            $('#' + id).addClass('is-visible');
        }, 100);

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
    },

    cycleQuestions: function() {
        $('.is-visible-2').removeClass('is-visible-2');
        $('.is-visible-1').removeClass('is-visible-1').addClass('is-visible-2');
        $('.is-visible').removeClass('is-visible').addClass('is-visible-1');
    }
};
