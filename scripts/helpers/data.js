var request = require('sync-request');
var fs = require('fs-extra');
var gridToAssets = require('../../scripts/helpers/gridToAssets.js');

var data, furniture;

function getBoldLength(copy) {
    if (copy.split('**').length > 1) {
        var copyLength = copy.split('**')[1].length;

        if (copyLength < 10) {
            return 'small'
        } else if (copyLength < 20) {
            return 'medium'
        } else {
            return 'large'
        }
    }
}

function setFurniture() {
    data = data.sheets;
    furniture = {}
    for (var i = 0; i < data.furniture.length; i++) {
        furniture[data.furniture[i].option] = data.furniture[i].value
    }
    data.furniture = furniture;
}

module.exports = function getData(explainer) {
    if (explainer.name !== 'local') {
        data = request('GET', explainer.data);
        data = JSON.parse(data.getBody('utf8'));
    } else {
        data = require('../../scripts/local.json');
    }

    setFurniture();
    getImages();

    return data;
};