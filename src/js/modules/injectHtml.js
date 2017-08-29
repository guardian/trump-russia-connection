var $ = require('../vendor/jquery.js');
var handlebars = require('handlebars');
var marked = require('marked');

var lastUpdated = require('../modules/lastUpdated.js');
var charts = require('../modules/charts.js');
var nav = require('../modules/nav.js');

var section = require('../templates/section.html');
var bio = require('../templates/bio.html');
var timeline = require('../templates/timeline.html');

var data;

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
            return string.replace(/ /g, '-').toLowerCase();
        });

        handlebars.registerHelper('numberise', function(number) {
            return (parseInt(number) + 1)  + '.'
        });

        handlebars.registerHelper('assetPath', function() {
            return '@@assetPath@@'
        });

        handlebars.registerHelper('marked', function(string) {
            return marked(string);
        });
    },

    getJson: function() {
        $.getJSON('https://interactive.guim.co.uk/docsdata-test/1As_b3BQ4IE444OgwNg-fqTF4tSfC51f4KKPSmQXtwhc.json', function(response) {
            data = response.sheets;

            for (var i in data.Main) {
                data[data.Main[i].key] = data.Main[i].option;
            }

            for (var i in data.Connections) {
                data.Connections[i].id = 'person-' + this.makeId();
                data.Connections[i].image = this.getImageUrl(data.Connections[i].image);
            }

            for (var i in data.Bios) {
                data.Bios[i].image = this.getImageUrl(data.Bios[i].image);
            }

            for (var i in data.Timeline) {
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
        this.addTimestamp();
        this.addSections();
        this.addChartData();
        this.addBios();
        this.addTimelines();
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

    addSections: function() {
        var template = handlebars.compile(section);
        $('.mapped-sections').html(template(data.Sections));
    },

    addChartData: function() {
        var chartData = {};

        $.each(data.Connections, function(i, person) {
            if (!chartData[person.section]) {
                chartData[person.section] = [];
            }

            chartData[person.section].push(person)
        }.bind(this));

        for (var i in chartData) {
            $('.mapped-section__chart[data-chart="' + i + '"]').attr('data-json', JSON.stringify(chartData[i]));
        }

        charts.init();
        nav.init();
    },

    addBios: function() {
        $.each(data.Bios, function(i, person) {
            var template = handlebars.compile(bio);
            $('.mapped-section__chart[data-chart="' + person.section + '"]').append(template(person));
        }.bind(this));
    },

    addTimelines: function() {
        $.each(data.Timeline, function(i, timelineMoment) {
            var template = handlebars.compile(timeline);
            $('.mapped-section__chart[data-chart="' + timelineMoment.section + '"]').append(template(timelineMoment));
        })
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
    }
};
