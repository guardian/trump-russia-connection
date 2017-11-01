var $ = require('../vendor/jquery.js');

var html = require('../templates/bio.html');

module.exports =  {
    create: function(id) {
        var template = handlebars.compile(html);

        $.each(data.Bios, function(i, bio) {
            $('#' + id).find('.mapped-card__chart').append(template(bio));
        });
    }
};
