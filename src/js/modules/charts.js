var $ = require('../vendor/jquery.js');
var d3 = require('d3');

module.exports =  {
    init: function() {
        $('.mapped-event__chart').each(function(i, el) {
            this.createChart(el);
        }.bind(this));
    },

    createChart: function(target) {
        var svg = d3.select(target),
            width = $(target).width(),
            height = $(target).height(),
            data = JSON.parse($(target).attr('data-json'));

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.name; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        var links = [];

        for (var i in data) {
            if (data[i].connected !== '') {
                var splitConnected = data[i].connected.split(', ',);
                splitConnected.forEach(function(target) {
                    links.push({
                        'source': data[i].name,
                        'target': target
                    });
                });
            }
        }

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", 1);

        // use some html here instead?!??!

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", '#ff5b3a')

        node.append("title")
            .text(function(d) { return d.name; });

        simulation
            .nodes(data)
            .on("tick", ticked);


        simulation.force("link")
            .links(links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
          }

    }
};
