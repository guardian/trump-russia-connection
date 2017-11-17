var $ = require('../vendor/jquery.js');

module.exports =  {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.mapped-header__expand').one('click', function() {
            this.expandIndex();
        }.bind(this));
    },

    expandIndex: function() {
        $('.mapped-header__questions--index').removeClass('is-collapsed').addClass('is-expanded');
    }
};