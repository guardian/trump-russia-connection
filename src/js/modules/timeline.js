var $ = require('../vendor/jquery.js');

var html = require('../templates/timeline.html');

module.exports =  {
    create: function(id) {
        var template = handlebars.compile(html);

        $.each(data.Timeline, function(i, bio) {
            $('#' + id).find('.mapped-card__chart').append(template(bio));
        });
    }
};
