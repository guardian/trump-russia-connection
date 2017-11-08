var $ = require('../vendor/jquery.js');

var bios = require('../modules/bios.js');
var timeline = require('../modules/timeline.js');
var connections = require('../modules/connections.js');

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
            this.openQuestion(e.currentTarget);
        }.bind(this));

        $('.mapped-mask, .mapped-close').click(function() {
            this.closeQuestions();
        }.bind(this));
    },

    compileTemplate: function() {
        cardTemplate = handlebars.compile(card);
    },

    openQuestion: function(question) {
        var id = $(question).attr('href').replace('#', '');
        var isFromStack = $(question).hasClass('mapped-card__title-link');
        var data = this.getData(id);

        // if user clicks on same question do nothing
        if (id === stack[0]) {
            return false;
        }

        if (isFromStack) {
            console.log(stack);
            console.log(id);
            console.log(stack.indexOf(id));
            stack = stack.slice(stack.indexOf(id), stack.length);
        } else {
            stack.unshift(id);
        }

        console.log(stack);

        if (!$('html').hasClass('is-open')) {
            $('html').addClass('is-open');
        }

        if ($('#' + id).length === 0) {
            $('.mapped').append(cardTemplate(data));
        }

        this.addChart(id);

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
        $('html').removeClass('is-open');
        $('.mapped-card').addClass('is-closing');

        setTimeout(function() {
            $('.mapped-card').removeClass('is-visible is-visible-1 is-visible-2 is-closing');
        }, 400);

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

            if (type === 'connections') {
                connections.create(id);
            }
        }

        $('#' + id).addClass('has-chart');
    }
};
