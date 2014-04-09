'use strict';

var app = angular.module('disBrowser');

app.factory('disservice', function ($http) {

    var disAPI = {};

    disAPI.categoryId;
    disAPI.connection;

    disAPI.textSearch = function (connection, view, text, pageNumber, pageSize) {
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/search/' + connection + '/fulltext?callback=JSON_CALLBACK&view=' + view + '&text=' + text + '&page=' + pageNumber + '&pageSize=' + pageSize
        });
    };

    disAPI.getCategories = function (connection, categoryId, recursive) {
        this.categoryId = categoryId;
        this.connection = connection;
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/search/' + connection + '/category?callback=JSON_CALLBACK&id=' + categoryId + '&recursive=' + recursive
        });
    };

    disAPI.assignItemToCategory = function (connection, itemId, categoryId) {
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/data/' + connection + '/addrecordtocategory?callback=JSON_CALLBACK&recordid=' + itemId + '&categoryid=' + categoryId
        });
    }

    disAPI.getRecentAssetsInCategory = function (connection, view, categoryId, recursive, direction, offset, count) {
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/search/' + connection + '/categoryquery?callback=JSON_CALLBACK&id=' + categoryId + '&recursive=' + recursive + '&view=' + view + '&offset=' + offset + '&count=' + count + '&sort=Asset Creation Date&direction=' + direction
        });
    }

    disAPI.validateUser = function (connection, u, p) {
        return false;
    };


    return disAPI;
});

app.factory('dataService', function ($rootScope) {

    var shared = {};
    shared.refreshRecentFilesEvent = function (data) {
        $rootScope.$broadcast("refreshRecentFiles", data);
    }

    shared.updateCurrentCategoryEvent = function (data) {
        $rootScope.$broadcast("updateCurrentCategory", data);
    }

    return shared;
});