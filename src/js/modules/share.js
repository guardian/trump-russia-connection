var $ = require('../vendor/jquery.js');

var pageUrl = window.location.href;
var title = 'Trump-Russia investigation: The key questions answered';

module.exports =  {
    init: function() {
        this.setLinks();
    },

    setLinks: function() {
        $('.mapped-share__button--twitter .mapped-share__link').attr('href', this.getTwitterLink());
        $('.mapped-share__button--facebook .mapped-share__link').attr('href', this.getFacebookLink());
        $('.mapped-share__button--email .mapped-share__link').attr('href', this.getEmailLink());
    },

    getTwitterLink: function(id) {
        return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + 
                ' ' + encodeURIComponent(pageUrl + '?CMP=share_btn_tw #TrumpRussia');
    },

    getFacebookLink: function(id) {
        return 'https://www.facebook.com/dialog/share?app_id=180444840287&href=' + encodeURIComponent(pageUrl + '?CMP=share_btn_fb');
    },

    getEmailLink: function(id) {
        return 'mailto:?subject=' + encodeURIComponent(title) +
                '&body=' + encodeURIComponent(pageUrl + '?CMP=share_btn_link');
    }
};