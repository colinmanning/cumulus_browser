'use strict';

var app = angular.module('disBrowser');

app.factory('disservice', function ($http) {

    var disAPI = {
        baseUrl: "http://dis.berlinirish.com"
    };

    disAPI.textSearch = function (connection, view, text, pageNumber, pageSize) {
        return $http({
            method: 'JSONP',
            url: "http://dis.berlinirish.com" + '/search/' + connection + '/fulltext?callback=JSON_CALLBACK&view=' + view + '&text=' + text + '&page=' + pageNumber + '&pageSize=' + pageSize
        });
    };

    disAPI.getCategories = function (connection, categoryPath, recursive) {
        return $http({
            method: 'JSONP',
            url: "http://dis.berlinirish.com" + '/search/' + connection + '/categories?path=' + categoryPath + '&recursive=' + recursive
        });
    };

    disAPI.validateUser = function (baseUrl, connection, u, p) {
        return {}
    };

    return disAPI;
});