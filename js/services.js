'use strict';

var app = angular.module('disBrowser');

app.factory('disservice', function ($http) {

    var disAPI = {};

    disAPI.categoryId;
    disAPI.connection;

    disAPI.describe = function (connection) {
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/admin/' + connection + '/describe?callback=JSON_CALLBACK'
        });
    };

    disAPI.textSearch = function (connection, view, text, pageNumber, pageSize) {
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/search/' + connection + '/fulltext?callback=JSON_CALLBACK&view=' + view + '&text=' + text + '&page=' + pageNumber + '&pageSize=' + pageSize
        });
    };

    disAPI.textSearchCategory = function (connection, view, text, pageNumber, pageSize) {
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/search/' + connection + '/categoryfulltext?callback=JSON_CALLBACK&view=' + view + '&text=' + text + '&page=' + pageNumber + '&pageSize=' + pageSize
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
            method: 'GET',
            url: app.baseUrl + '/data/' + connection + '/addrecordtocategory?callback=JSON_CALLBACK&recordid=' + itemId + '&categoryid=' + categoryId
        });
    }

    disAPI.getRecentAssetsInCategory = function (connection, view, categoryId, recursive, direction, offset, count) {
        return $http({
            method: 'JSONP',
            url: app.baseUrl + '/search/' + connection + '/categoryquery?callback=JSON_CALLBACK&id=' + categoryId + '&recursive=' + recursive + '&view=' + view + '&offset=' + offset + '&count=' + count + '&sort=Asset Creation Date&direction=' + direction
        });
    }

    disAPI.postMetadata = function (connection, itemId, upload_data) {
        return $http({
            method: 'POST',
            url: app.baseUrl + '/data/' + connection + '/update?id=' + itemId,
            headers: {'Content-Type': 'application/json; charset=utf8'},
            data: upload_data
        });
    }

    disAPI.validateUser = function (connection, u, p) {
        //mock testing function

        if (!u || !p) {
            u = "sddcssccsssddsd";
            p = "1212wekwkncekcmoevve"
        }
        ;

        var theUrl = app.baseUrl + "/admin/" + connection + "/getuser?s=" + u + "&g=" + p + "&callback=JSON_CALLBACK";
        return $http({
            method: 'JSONP',
            url: theUrl
        });
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

    shared.metadataVaildationEvent = function (data) {
        $rootScope.$broadcast("metadataVaildation", data);
    }

    shared.sendMetadatataEvent = function (data) {
        $rootScope.$broadcast("sendMetadata", data);
    }

    shared.requestMetadatataEvent = function (data) {
        $rootScope.$broadcast("requestMetadata", data);
    }

    return shared;
});

app.factory('alertService', function ($rootScope) {

    var alertService = {};
    $rootScope.alerts = [];
    $rootScope.uploadAlerts = [];

    alertService.add = function (type, msg) {
        $rootScope.alerts.push({type: type, msg: msg});
    };

    alertService.closeAlert = function (index) {
        $rootScope.alerts.splice(index, 1);
    };

    alertService.clear = function () {
        $rootScope.alerts = [];
    }

    alertService.addUploadAlert = function (type, msg) {
        $rootScope.uploadAlerts.push({type: type, msg: msg});
    };

    alertService.closeUploadAlert = function (index) {
        $rootScope.uploadAlerts.splice(index, 1);
    };

    alertService.clearUploadAlerts = function () {
        $rootScope.uploadAlerts = [];
    }

    return alertService;

});

app.factory('authService', function ($rootScope, ipCookie) {

    var authService = {};

    authService.user;
    authService.userData
    authService.lang = app.lang;

    authService.isSessionAlive = function () {
        return  ipCookie(app.authCookieName);
    };

    authService.setLang = function (lang) {
        authService.lang = lang;
    };

    authService.getLang = function () {
        return authService.lang;
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
            window.location = "#/" + authService.lang + "/login/" + authService.user;
        } else {
            window.location = "#/" + authService.lang + "/login/";
        }
    }

    authService.getUserData = function () {
        return authService.userData;
    }

    authService.setUserData = function (userData) {
        authService.userData = userData;
    }

    return authService;

});


