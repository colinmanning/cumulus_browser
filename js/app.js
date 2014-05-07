(function () {

    var app = angular.module('disBrowser', ['angularFileUpload', 'ui.bootstrap', 'ngCookies', 'ngRoute',
        'ivpusic.cookie', 'pascalprecht.translate',
        'uploaderControllers']);

    app.lang = "en";
    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/login/:cu', {
                    templateUrl: 'partials/login.html',
                    controller: 'disUserController'
                }).
                when('/:lang/login/:cu', {
                    templateUrl: 'partials/login.html',
                    controller: 'disUserController'
                }).
                when('/login', {
                    redirectTo: '/' + app.lang + '/login'
                }).
                when('/:lang/login', {
                    templateUrl: 'partials/login.html',
                    controller: 'disUserController'
                }).
                when('/upload', {
                    templateUrl: 'partials/upload.html',
                    controller: 'disUserController'
                }).
                when('/:lang/upload', {
                    templateUrl: 'partials/upload.html',
                    controller: 'disUserController'
                }).
                when('/upload_norecent', {
                    templateUrl: 'partials/upload_no_recent.html',
                    controller: 'disUserController'
                }).
                when('/:lang/upload_norecent', {
                    templateUrl: 'partials/upload_no_recent.html',
                    controller: 'disUserController'
                }).
                otherwise({
                    redirectTo: '/login/:cu'
                });
        }]);


    app.config(['$translateProvider',
        function ($translateProvider) {
            $translateProvider
                .translations('se', translations_se_SE)
                .translations('de', translations_de_DE)
                .translations('en', translations_en_GB)
                .fallbackLanguage('en');
            $translateProvider.preferredLanguage(app.lang);
        }]);

    app.baseUrl = "http://dis.berlinirish.com";
    app.disConnection = "sample-2";
    app.disView = "overview";
    app.rootCategory = { id: 1, path: "$Categories"};
    app.recentFileFetchInterval = -1;
    app.recentFileRefreshButtonShow = true;
    app.recentFileFetchCount = 10;
    app.sessionDuration = 30; //in minutes
    app.authCookieName = 'setantaMediaApprover';
    app.enableMtadata = true;
    app.updatedByField = "Updated By";

})();