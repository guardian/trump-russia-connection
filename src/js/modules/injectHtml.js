var $ = require('../vendor/jquery.js');
var marked = require('marked');
window.handlebars = require('handlebars');

var lastUpdated = require('../modules/lastUpdated.js');
var question = require('../modules/question.js');

var questionHtml = require('../templates/question.html');

module.exports =  {
    init: function() {
        this.initHandlebars();
        this.getJson();
    },

    initHandlebars: function() {
        handlebars.registerHelper('if_eq', function(a, b, opts) {
            if(a == b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        });

        handlebars.registerHelper('handelise', function(string) {
            return this.handelise(string);
        }.bind(this));

        handlebars.registerHelper('numberise', function(number) {
            return (parseInt(number) + 1)  + '.'
        });

        handlebars.registerHelper('assetPath', function() {
            return '@@assetPath@@'
        });

        handlebars.registerHelper('marked', function(string) {
            return marked(string);
        });

        handlebars.registerHelper('relativeTime', function(string) {
            if (string) {
                return lastUpdated.convert(string);
            } else {
                return '';
            }
        });

        handlebars.registerPartial('question', questionHtml);
    },

    getJson: function() {
        $.getJSON('https://interactive.guim.co.uk/docsdata-test/1As_b3BQ4IE444OgwNg-fqTF4tSfC51f4KKPSmQXtwhc.json', function(response) {
            window.data = response.sheets;

            for (var i in data.Main) {
                data[data.Main[i].key] = data.Main[i].option;
            }

            for (var i in data.Questions) {
                data.Questions[i].id = this.handelise(data.Questions[i].question);
            }

            for (var i in data.Connections) {
                data.Connections[i].id = this.handelise(data.Connections[i].question);
                data.Connections[i].personId = 'person-' + this.makeId();
                data.Connections[i].image = this.getImageUrl(data.Connections[i].image);
            }

            for (var i in data.Bios) {
                data.Bios[i].id = this.handelise(data.Bios[i].question);
                data.Bios[i].image = this.getImageUrl(data.Bios[i].image);
            }

            for (var i in data.Timeline) {
                data.Timeline[i].id = this.handelise(data.Timeline[i].question);
//                 data.Timeline[i].image = this.getImageUrl(data.Timeline[i].image);
            }

            delete data.Main;

            this.injectHtml();
        }.bind(this));
    },

    getImageUrl: function(url) {
        var newUrl = url.replace('.gutools', '.guim').replace('/images', '').replace('?crop=', '/') + '/140.jpg';
        return newUrl;
    },

    injectHtml: function() {
        this.addIntro();
        this.addStarterQuestions();
        this.addTimestamp();
        this.markAsLoaded();
    },

    addIntro: function() {
        var markedIntro = marked(data.intro);
        var intro = markedIntro.slice(3);
        var firstCharacter = intro.substring(0, 1);
            intro = intro.slice(1);

        $('.mapped-header__intro').html('<p><span class=\'mapped-header__drop-cap\'><span class=\'mapped-header__drop-cap__inner\'>' + firstCharacter + '</span></span>' + intro);
    },

    addTimestamp: function() {
        $('.mapped-header__last-updated').text('Last Updated ' + lastUpdated.convert(data.lastUpdated));
    },

    addStarterQuestions: function() {
        var questionTemplate = handlebars.compile(questionHtml);

        for (var i in data.Questions) {
            if (data.Questions[i].question !== '' && data.Questions[i].isStarter) {
                $('.mapped-header__questions').append(questionTemplate(data.Questions[i]));
            }
        }
    },

    makeId: function() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },

    markAsLoaded: function() {
        $('.mapped').addClass('has-loaded');

        question.init();
    },

    handelise: function(string) {
        return string.replace(/ /g, '-').replace('?', '').replace(/'/g, '').replace(':', '').replace('/', '').toLowerCase();
    }
};
