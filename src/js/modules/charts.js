var $ = require('../vendor/jquery.js');
var d3 = require('d3');

module.exports =  {
    init: function() {
        this.setSizes();

        $('.mapped-event__chart').each(function(i, el) {
            this.createChart(el);
        }.bind(this));

        this.bindings();
    },

    bindings: function() {
        $(window).resize(function() {
            this.setSizes();
        }.bind(this));
    },

    setSizes: function() {
        $('.mapped-event__chart').each(function(i, el) {
            var width = $(el).width();
            var height = $(el).height();

            $(el).attr('viewbox', '0 0 ' + width + ' ' + height);
        });
    },

    createChart: function(target) {
        var svg = d3.select(target),
            width = 920,
            height = 500,
            radius = 60,
            n = 20,
            data = JSON.parse($(target).attr('data-json'));

        var links = [];

        for (var i in data) {
            // build links
            if (data[i].connected !== '') {
                var splitConnected = data[i].connected.split(', ',);
                splitConnected.forEach(function(target) {
                    links.push({
                        'source': data[i].name,
                        'target': target
                    });
                });
            }

            // unique IDs
            data[i].id = 'person-' + this.makeId();
        }

        var simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(function(d) { return d.name; }).distance(10).iterations(5))
            .force('charge', d3.forceManyBody().strength(2))
            .force('collision', d3.forceCollide(radius * 2))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .stop();

        var link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke-width', 5);

        var circle = svg.append('defs')
            .selectAll('circle')
            .data(data)
            .enter().append('clipPath')
            .attr('id', function(d) { return d.id })
            .append('circle')
            .attr('r', radius);

        var node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(data)
            .enter()

        var image = node.append('image')
            .attr('class', 'mapped-chart__image')
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .attr('clip-path', function(d) { return 'url(#' + d.id + ')' })
            .attr('xlink:href', 'assets/images/placeholder.jpg');

        var label = node.append('text')
            .attr('text-anchor', 'middle')
            .attr('class', 'mapped-chart__name');

            label.append('tspan')
            .attr('width', radius * 2)
            .text(function (d) { return d.name; });

        simulation
            .nodes(data)

        simulation.force('link')
            .links(links);

        for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
            simulation.tick();

            link
                .attr('x1', function(d) { return d.source.x + radius; })
                .attr('y1', function(d) { return d.source.y + radius; })
                .attr('x2', function(d) { return d.target.x + radius; })
                .attr('y2', function(d) { return d.target.y + radius; });

            image
                .attr('x', function(d) { return d.x = Math.max(radius, Math.min(width - radius * 2, d.x)) })
                .attr('y', function(d) { return d.y = Math.max(radius, Math.min(height - radius * 2, d.y)) });

            label
                .attr('x', function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)) + radius })
                .attr('y', function(d) { return d.y = Math.max(radius * 2, Math.min(height - radius * 2, d.y)) + (radius * 2) + 20; });

            circle
                .attr('cx', function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)) })
                .attr('cy', function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)) - (radius + 15) });
        }
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
