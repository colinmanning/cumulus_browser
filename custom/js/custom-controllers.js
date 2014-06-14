'use strict';

var uploaderControllers = angular.module('uploaderControllers');

uploaderControllers.controller('customMetadataController', function ($translate, $scope, dataService, customMetadataService) {

    $scope.fields = customMetadataService.getFields();
    $scope.formname = customMetadataService.getFormname();
    $scope.isvalid = customMetadataService.getIsvalid();

    $scope.$watchCollection('[fields.caption.value, fields.notes.value]', function (newValue, oldValue) {
        customMetadataService.setFields($scope.fields);
    });

    $scope.$watch('metadataform.$valid', function (newValue, oldValue) {
        //if (newValue === oldValue) return;
        $scope.isvalid = newValue;
        customMetadataService.setIsvalid(newValue);
        customMetadataService.setFields($scope.fields);
        customMetadataService.metadataVaildationEvent($scope.isvalid);
    });


    $scope.metadataEditDone = function () {
        $modalInstance.close($scope);
    };

    $scope.metadataEditCancelled = function () {
        $modalInstance.dismiss('cancel');
    };
});

uploaderControllers.controller('customSearchController',
    function ($translate, $scope, dataService, customMetadataService, uiService) {

        $scope.doSearch = function doSearch() {
            if (!authService.isSessionAlive()) {
                authService.goToLoginPage();
            }
            if ($scope.searchtext && $scope.searchtext != "") {
                disservice.textSearch($scope.connection, $scope.searchtext, false, true, false).success(function (response) {
                    $scope.isMatch = true;
                    $scope.isRoot = true;
                    $scope.categories = [];
                    for (var i = 0; i < response.length; i++) {
                        var scat = response[i];
                        var scat_path = scat.path;
                        //scat_path = category.path + ":" + scat.name;
                        $scope.categories.push({ id: scat.id, name: scat.name, path: scat_path, parent: scat.parent});

                    }
                    dataService.updateCurrentCategoryEvent(false);
                }).error(function (response) {
                    alert(response);
                });
            }
        }

    });

uploaderControllers.controller('customAssetController',
    function ($translate, $scope, dataService, customMetadataService, uiService) {

        $scope.DUMMY_ASSET = {loocation: {latitude: 0.0, longitude: 0.0}};

        $scope.fields = customMetadataService.getFields();
        $scope.currentAsset = $scope.DUMMY_ASSET;
        $scope.hasAsset = false;

        $scope.$on(uiService.EVENT_CURRENT_ASSET_CHANGED, function (event, args) {
            $scope.currentAsset = args;
            $scope.hasAsset = true;
        });
    });

uploaderControllers.controller('customAssetListController',
    function ($translate, $scope, $modal, $interval, disservice, customMetadataService, uiService) {
        $scope.fields = customMetadataService.getFields();
        $scope.assets = {};
        $scope.connection = app.disConnection;
        $scope.view = app.disView;
        $scope.hasAssets = false;
        $scope.currentAsset = {}
        $scope.totalItems = 0;
        $scope.timedFetchAtcive = (app.recentFileFetchInterval >= 10);
        $scope.showRefreshButton = app.recentFileRefreshButtonShow;
        $scope.currentSearchDetails = {};
        this.timedRefresh;


        $scope.getRecentAssetsInCategory = function getRecentAssetsInCategory(categoryId, recursive, direction) {
            $scope.currentSearchDetails.categoryId = categoryId;
            $scope.currentSearchDetails.recursive = recursive;
            $scope.currentSearchDetails.direction = direction;
            disservice.getRecentAssetsInCategory($scope.connection, $scope.view, categoryId, recursive, direction, 0, app.recentFileFetchCount).success(function (response) {
                var jassets = [];
                for (var i = 0; i < response.records.length; i++) {
                    var jasset = response.records[i];
                    if (jasset.Latitude && jasset.Longitude) {
                        jasset.location = {};
                        jasset.location.latitude = jasset.Latitude;
                        jasset.location.longitude = jasset.Longitude;
                    }
                    jassets[i] = jasset;
                }
                $scope.assets.count = response.count;
                $scope.assets.total = response.total;
                $scope.assets.records = jassets;
                $scope.totalItems = $scope.assets.total;
                $scope.hasAssets = ($scope.assets.total > 0);
            }).error(function (response) {
                doClear();
            });
        };

        $scope.refreshRecentAssetsInCategory = function refreshRecentAssetsInCategory() {
            disservice.getRecentAssetsInCategory($scope.connection, $scope.view, $scope.currentSearchDetails.categoryId, $scope.currentSearchDetails.recursive, $scope.currentSearchDetails.direction, 0, app.recentFileFetchCount).success(function (response) {
                $scope.assets = response;
                $scope.totalItems = $scope.assets.total;
                $scope.hasAssets = ($scope.assets.total > 0);
            }).error(function (response) {
                doClear();
            });
        };

        var doClear = function doClear() {
            $scope.assets = {};
            $scope.hasAssets = false;
        };

        $scope.doSetAsset = function doSetAsset(asset) {
            uiService.setCurrentAsset(asset);
        };

        $scope.doPreview = function doPreview(asset) {
            $scope.currentAsset = asset;
            var previewModalInstance = $modal.open({
                templateUrl: 'custom/partials/custom-asset-preview.html',
                controller: 'disPreviewInstanceController',
                resolve: {
                    asset: function () {
                        return $scope.currentAsset;
                    }
                }
            });

            previewModalInstance.result.then(function () {
                //on ok button press
            }, function () {
                //on cancel button press
            });

        };

        $scope.doFetch = function doFetch() {
            $scope.refreshRecentAssetsInCategory();
        }

        this.doClear = function doClear() {
            this.searchText = '';
            $scope.assets = {};
            $scope.hasAssets = false;
        };

        if (!disservice.categoryId) {
            disservice.categoryId = app.rootCategory.id;
        }

        $scope.$on('$destroy', function () {
            // Make sure that the interval is destroyed too
            if ($scope.timedFetchAtcive) {
                $interval.cancel(timedRefresh);

            }
        });

        $scope.$on("refreshRecentFiles", function (event, args) {
            $scope.getRecentAssetsInCategory(args.categoryId, args.recursive, args.direction);
        });

        $scope.getRecentAssetsInCategory(disservice.categoryId, true, "descending");

        if ($scope.timedFetchAtcive) {
            this.timedRefresh = $interval($scope.refreshRecentAssetsInCategory, app.recentFileFetchInterval * 1000);
        }

    });
