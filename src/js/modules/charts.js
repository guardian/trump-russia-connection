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

    getAssetPath: function() {
        return $('.mapped').attr('data-asset-path');
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

    getCollision: function(radius, length) {
        var distance = Math.abs(15 / -(length));

        if (distance > 3) {
            distance = 3;
        } else if (distance < 1.2) {
            distance = 1.2;
        }

        return radius * distance;
    },

    createChart: function(target) {
        var svg = d3.select(target),
            width = 920,
            height = 500,
            radius = 60,
            data = JSON.parse($(target).attr('data-json'))
            length = data.length,
            links = this.buildLinks(data);

        var simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(function(d) { return d.name; }))
            .force('collision', d3.forceCollide(this.getCollision(radius, length)).strength(3))
            .force('center', d3.forceCenter(width / 2 , height / 2))
            .stop();

        var defs = svg.append('defs')

        var circle = defs.selectAll('circle')
            .data(data)
            .enter().append('clipPath')
            .attr('id', function(d) { return d.id })
            .append('circle')
            .attr('r', radius);

        var lines = defs.selectAll('links')
            .data(links)
            .enter().append('path')
            .attr('id', function(d) { return d.linkId });

        var link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter().append('image')
            .attr('xlink:href', this.getAssetPath() + '/assets/images/line.svg');

        var linkCopy = svg.append('g')
            .attr('class', 'linkCopy')
            .selectAll('line')
            .data(links)
            .enter().append('text')
            .attr('class', 'mapped-chart__link-copy')
            .attr('text-anchor', 'middle')

            linkCopy.append('textPath')
            .attr('xlink:href', function(d) { return '#' + d.linkId })
            .attr('startOffset', '50%')
            .text(function(d) { return d.linkCopy });

        var node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(data)
            .enter()

        var boxes = node.append('rect')
            .attr('width', radius * 2)
            .attr('height', 20)
            .attr('style', 'fill: white;');

        var image = node.append('image')
            .attr('class', 'mapped-chart__image')
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .attr('clip-path', function(d) { return 'url(#' + d.id + ')' })
            .attr('xlink:href',  function(d) {return d.image } );

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

            image
                .attr('x', function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)) - 60 })
                .attr('y', function(d) { return d.y = Math.max(radius , Math.min(height - radius * 2 , d.y) - 60) });

            circle
                .attr('cx', function(d) { return d.x + radius })
                .attr('cy', function(d) { return d.y + radius });

            label
                .attr('x', function(d) { return d.x + radius; })
                .attr('y', function(d) { return d.y + (radius * 2) + 20; });

            boxes
                .attr('x', function(d) { return d.x })
                .attr('y', function(d) { return d.y + (radius * 2) + 5});

            link
                .attr('x', function(d) { return d.source.x + radius })
                .attr('y', function(d) { return d.source.y + radius })
                .attr('width', function(d) { return Math.sqrt( (d.source.x - d.target.x) * (d.source.x - d.target.x) + (d.source.y - d.target.y) * (d.source.y - d.target.y) )})
                .attr('style', function(d) { return 'transform-origin: center left; transform: rotate(' + (Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180 / Math.PI) + 'deg)'});

            lines
                .attr('d', function(d) { return this.drawLine(d, radius) }.bind(this))
                .attr('style', function(d) { if (d.source.x > d.target.x) { return 'transform-origin: center center; transform: rotate(180deg) translateY(-20px)'; } })

        }
    },

    buildLinks: function(data) {
        var links = [];

        for (var i in data) {
            if (data[i].connected !== '') {
                var splitConnected = data[i].connected.split(', ',);

                splitConnected.forEach(function(target) {
                    if (target.indexOf(' - ') > -1) {
                        var split = target.split(' - ');
                        target = split[0];
                        var linkCopy = split[1];
                    }

                    links.push({
                        'linkId': this.makeId(),
                        'source': data[i].name,
                        'target': target,
                        'linkCopy': linkCopy ? linkCopy : ''
                    });
                }.bind(this));
            }
        }

        return links;
    },

    drawLine: function(d, radius) {
        var length = Math.sqrt( (d.source.x - d.target.x) * (d.source.x - d.target.x) + (d.source.y - d.target.y) * (d.source.y - d.target.y) );

            points = (d.source.x + radius) + ' ' + (d.source.y + radius) + ' ' + (d.target.x + radius) + ' ' + (d.target.y + radius);

        return 'M' + points;
    },

    lineRotation: function(d, radius) {
        if (d.target.x > d.source.x) {
            return 0;
        } else {
            return ((Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180 / Math.PI) - 180);
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
