'use strict';

var app = angular.module('disBrowser');

app.factory('disservice', function ($http, baseUrl) {

    var disAPI = {};
    disApi.baseUrl = baseUrl

    disAPI.textSearch = function (connection, view, text, pageNumber, pageSize) {
        return $http({
            method: 'JSONP',
            url: baseUrl + '/search/' + connection + '/fulltext?callback=JSON_CALLBACK&view=' + view + '&text=' + text + '&page=' + pageNumber + '&pageSize=' + pageSize
        });
    };

    disAPI.getCategories = function (connection, categoryPath, recursive) {
        return $http({
            method: 'JSONP',
            url: baseUrl + '/search/' + connection + '/categories?path=' + categoryPath + '&recursive=' + recursive
        });
    };

    disAPI.validateUser = function (connection, u, p) {
        return {}
    };

    return disAPI;
});