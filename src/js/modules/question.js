var $ = require('../vendor/jquery.js');

var card = require('../templates/card.html');

var cardTemplate;

module.exports =  {
    init: function() {
        this.bindings();
        this.compileTemplate();
    },

    bindings: function() {
        $('a.is-question').click(function(e) {
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

        if (!$('body').hasClass('is-open')) {
            $('body').addClass('is-open');
        }

        $('.mapped').append(cardTemplate(data));
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
    }
};
