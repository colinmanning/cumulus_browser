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
        //mock testing function
        if (u = 'demo53' && p == 'demo13') {
            return $http({
                method: 'get',
                url: app.baseUrl
            });
        } else {
            return $http({
                method: 'JSONP',
                url: app.baseUrl
            });
        }

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

app.factory('alertService', function ($rootScope) {

    var alertService = {};
    $rootScope.alerts = [];

    alertService.add = function (type, msg) {
        $rootScope.alerts.push({type: type, msg: msg});
    };

    alertService.closeAlert = function (index) {
        $rootScope.alerts.splice(index, 1);
    };

    alertService.clear = function () {
        $rootScope.alerts = [];
    }

    return alertService;

});

app.factory('authService', function ($rootScope, ipCookie) {

    var authService = {};

    authService.user;


    authService.isSessionAlive = function () {

        return  ipCookie(app.authCookieName);

    };

    authService.setSession = function (duration, user) {
        authService.user = user;
        ipCookie(app.authCookieName, 'true', { 'expires': duration, expirationUnit: 'minutes'});
    }

    authService.logout = function () {
        ipCookie.remove(app.authCookieName);
    }

    authService.goToLoginPage = function () {
        if (authService.user != undefined) {
            window.location = "#/login/"+authService.user;
        } else {
            window.location = "#/login/";
        }

    }

    return authService;

});


