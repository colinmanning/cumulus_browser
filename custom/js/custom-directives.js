var app = angular.module('disBrowser');

app.directive('customAssetList', function () {

        return {
            restrict: 'E',
            templateUrl: 'custom/partials/custom-asset-list.html',
            transclude: true
        }
    }
)

app.directive('customAssetView', function () {

        return {
            restrict: 'E',
            templateUrl: 'custom/partials/custom-asset-view.html',
            transclude: true
        }
    }
)
