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

    app.baseUrl = "http://localhost:8084/disweb";
    app.disConnection = "sample";
    app.disView = "overview";
    app.rootCategory = { id: 1, path: "$Categories"};
    app.recentFileFetchInterval = -1;
    app.recentFileRefreshButtonShow = true;
    app.recentFileFetchCount = 10;

    app.metadataPanels = {
        fileUploadMetadata: [
            { sequence: 1, type: 'text', fieldName: 'Caption', displayName: 'Captionm', mandatory: true, default: ''},
            { sequence: 1, type: 'textarea', fieldName: 'Notes', displayName: 'Notes', mandatory: false, default: ''}
        ]
    }

})();