(function(){

    var app = angular.module('disBrowser', ['angularFileUpload', 'ui.bootstrap', 'ngCookies', 'ngRoute', 'uploaderControllers']);

    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/login/:cu', {
                    templateUrl: 'partials/login.html',
                    controller: 'disUserController'
                }).
                when('/upload', {
                    templateUrl: 'partials/upload.html',
                    controller: 'disUserController'
                }).
                otherwise({
                    redirectTo: '/login/:cu'
                });
        }]);

    app.baseUrl = "http://dis.berlinirish.com";
    app.disConnection = "sample-2";
    app.disView = "overview";
    app.rootCategory = { id: 1, path: "$Categories"};
    app.recentFileFetchInterval = -1;
    app.recentFileRefreshButtonShow = true;
    app.recentFileFetchCount = 10;

})();