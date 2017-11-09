var $ = require('../vendor/jquery.js');

var html = require('../templates/timeline.html');

module.exports =  {
    create: function(id) {
        var template = handlebars.compile(html);

        $.each(data.Timeline, function(i, timelineEvent) {
            if (timelineEvent.id === id) {
                $('#' + id).find('.mapped-card__chart').append(template(timelineEvent));
            }
        });
    }
};
