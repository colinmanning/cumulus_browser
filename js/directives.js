var app = angular.module('disBrowser');

app.directive('disSearch', function () {
        return {
            restrict: 'A'
        }
    }
)

app.directive('disCategoryPanel', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/dis-category-panel.html',
            transclude: true
        }
    }
)

app.directive('disCategoryBreadcrumbs', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/dis-category-breadcrumbs.html',
            transclude: true
        }
    }
)

app.directive('disFileUploadPanel', function () {

        return {
            restrict: 'E',
            templateUrl: 'partials/dis-file-upload-panel.html',
            transclude: true
        }
    }
)

app.directive('disAssetList', function () {

        return {
            restrict: 'E',
            templateUrl: 'partials/dis-asset-list.html',
            transclude: true
        }
    }
)

app.directive('disRecentAssetList', function () {

        return {
            restrict: 'E',
            templateUrl: 'partials/dis-recent-asset-list.html',
            transclude: true
        }
    }
)

app.directive('checkUser', ['$rootScope', 'authService', function ($root, authService) {

    return {
        link: function (scope) {
           var isAlive = authService.isSessionAlive();
           $root.$watch(!isAlive, function () {
                console.info('fire!');
               if(!isAlive) {
                   authService.goToLoginPage();
               }

            });
        }
    }
}])

