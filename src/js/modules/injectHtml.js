var $ = require('../vendor/jquery.js');
var handlebars = require('handlebars');
var marked = require('marked');

var lastUpdated = require('../modules/lastUpdated.js');
var charts = require('../modules/charts.js');
var dates = require('../modules/dates.js');
var scrollTo = require('../modules/scrollTo.js');

var event = require('../templates/event.html');

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

        handlebars.registerHelper('getImage', function(url, size) {
            var crop = url.split('?crop=')[1];
            var url = url.replace('gutools.co.uk', 'guim.co.uk');
                url = url.replace('http://', 'https://');
                url = url.replace('images/', '');
                url = url.split('?')[0];
                url = url + '/' + crop + '/' + size + '.jpg';

            return '<img class="trump-tracker__day-image" src="' + url + '"/>'
        });

        handlebars.registerHelper('handelise', function(string) {
            return string.replace(/ /g, '-').toLowerCase();
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

            delete data.Main;

            this.injectHtml();
        }.bind(this));
    },

    getImageUrl: function(url) {
        // https://media.gutools.co.uk/images/6536326d8607bce1684588a9afcdd7255c46b5ba?crop=991_0_3089_3089
        // https://media.guim.co.uk/6536326d8607bce1684588a9afcdd7255c46b5ba/991_0_3089_3089/140.jpg
        var newUrl = url.replace('.gutools', '.guim').replace('/images', '').replace('?crop=', '/') + '/140.jpg';
        return newUrl;
    },

    injectHtml: function() {
        this.addIntro();
        this.addTimestamp();
        this.addEvents();
        this.addChartData();
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

    addEvents: function() {
        var template = handlebars.compile(event);
        $('.mapped-events').html(template(data.Events));
    },

    addChartData: function() {
        var chartData = {};

        $.each(data.Connections, function(i, person) {
            if (!chartData[person.event]) {
                chartData[person.event] = [];
            }

            chartData[person.event].push(person)
        }.bind(this));

        for (var i in chartData) {
            $('.mapped-event__chart[data-chart="' + i + '"]').attr('data-json', JSON.stringify(chartData[i]));
        }

        charts.init();
        dates.init();
        scrollTo.init();
    },

    makeId: function() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }
};
