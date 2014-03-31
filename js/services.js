'use strict';

var app = angular.module('disBrowser');

app.factory('disservice', function ($http) {

    var disAPI = {};

    disAPI.textSearch = function (connection, view, text, pageNumber, pageSize) {
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/search/' + connection + '/fulltext?callback=JSON_CALLBACK&view=' + view + '&text=' + text + '&page=' + pageNumber + '&pageSize=' + pageSize
        });
    };

    disAPI.getCategories = function (connection, categoryPath, recursive) {
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/search/' + connection + '/categories?path=' + categoryPath + '&recursive=' + recursive
        });
    };

    disAPI.validateUser = function (connection, u, p) {
        return false;
    };

    return disAPI;
});