'use strict';

var app = angular.module('disBrowser');

app.controller('disUserController', function ($location, $scope, disservice) {
    $scope.cumulusUser = ($location.search()).cu;
    $scope.user = {};
    $scope.loggedIn = false;

    this.doValidateUser = function doValidateUser(password) {
        disservice.validateUser(this.connection, $scope.cumulusUser, password).success(function (response) {
            $scope.loggedIn = true;
            $scope.user = response;
            $scope.hasAssets = ($scope.assets.total > 0);
            $scope.hasAssets = true;
        }).error(function (response) {
            $scope.user = {};
            $scope.loggedIn = false;
        });
    }
});

app.controller('disAssetsController', function ($scope, $modal, disservice) {
    $scope.assets = {};
    this.connection = app.disConnection;
    this.view = app.disView;
    this.searchText = '';
    $scope.hasAssets = false;
    $scope.currentAsset = {}
    $scope.totalItems = 64;
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.showPager = false;
    $scope.pageSize = 10;

    this.doTextSearch = function doTextSearch() {
        disservice.textSearch(this.connection, this.view, this.searchText, $scope.currentPage, $scope.pageSize).success(function (response) {
            $scope.assets = response;
            $scope.totalItems = $scope.assets.total;
            $scope.showPager = $scope.totalItems > $scope.pageSize;
            $scope.hasAssets = ($scope.assets.total > 0);
        }).error(function (response) {
            this.doClear();
        });
    };

    $scope.doSelectPage = function doSelectPage(pageNo) {

    };

    $scope.doPreview = function doPreview(asset) {
        $scope.currentAsset = asset;
        var modalInstance = $modal.open({
            templateUrl: 'partials/dis-asset-preview.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return asset;
                }
            }
        });

        modalInstance.result.then(function () {
            //on ok button press
        }, function () {
            //on cancel button press
        });

    };

    var doClear = function doClear() {
        this.searchText = '';
        $scope.assets = {};
        $scope.hasAssets = false;
    };

    //this.doTextSearch();

});

app.controller('disRecentAssetsController', function ($scope, $modal, $interval, disservice) {
    $scope.assets = {};
    $scope.connection = app.disConnection;
    $scope.view = app.disView;
    $scope.hasAssets = false;
    $scope.currentAsset = {}
    $scope.totalItems = 0;
    $scope.timedFetchAtcive = (app.recentFileFetchInterval >= 10);
    $scope.currentSearchDetails = {};
    this.timedRefresh;


    $scope.getRecentAssetsInCategory = function getRecentAssetsInCategory(categoryId, recursive, direction) {
        $scope.currentSearchDetails.categoryId = categoryId;
        $scope.currentSearchDetails.recursive = recursive;
        $scope.currentSearchDetails.direction = direction;
        disservice.getRecentAssetsInCategory($scope.connection, $scope.view, categoryId, recursive, direction, 0, app.recentFileFetchCount).success(function (response) {
            $scope.assets = response;
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

    $scope.doPreview = function doPreview(asset) {
        $scope.currentAsset = asset;
        var modalInstance = $modal.open({
            templateUrl: 'partials/dis-asset-preview.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return asset;
                }
            }
        });

        modalInstance.result.then(function () {
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


var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
    $scope.items = items;

    $scope.ok = function () {
        $modalInstance.close($scope);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


app.controller('disAssetController', function ($scope, disservice) {
        $scope.asset = {};
        $scope.dirty = false;
    }
);

app.controller('disCategoryBreadcrumbsController', function ($scope, disservice, dataService) {
    $scope.currentCategory = {};

    $scope.$on("updateCurrentCategory", function (event, args) {
        $scope.currentCategory = args;
    });
});

app.controller('disCategoryController', function ($scope, disservice, dataService) {
    $scope.category = {};
    $scope.recursive = false;

    $scope.connection = app.disConnection;
    $scope.categoryId = -1;
    $scope.recursive = 'false';
    $scope.isRoot = true;
    $scope.currentCategory = undefined;
    $scope.categories = [];

    $scope.doGetCategories = function doGetCategories(connection, category, recursive, isRoot) {
        // $scope.categoryId = categoryId
        $scope.isRoot = (category.parent === undefined);
        disservice.getCategories(connection, category.id, recursive, isRoot).success(function (response) {
            $scope.categoryId = response.id;
            $scope.hasSubcategories = (response.hasChildren == true);
            if ($scope.hasSubcategories) {
                $scope.categories = [];
                for (var i = 0; i < response.subcategories.length; i++) {
                    var scat = response.subcategories[i];
                    var scat_path = "";
                    scat_path = category.path + ":" + scat.name;
                    $scope.categories.push({ id: scat.id, name: scat.name, path: scat_path, parent: category});
                }
            } else {
                $scope.categories = [];
            }
            $scope.currentCategory = category;
            dataService.refreshRecentFilesEvent({categoryId: category.id, recursive: true, direction: 'descending'});
        });
    };

    $scope.showCategories = function showCategories(category) {
        $scope.doGetCategories($scope.connection, category, $scope.recursive, false);
        dataService.updateCurrentCategoryEvent(category);
    }

    $scope.showParentCategory = function showParentCategory() {
        if ($scope.currentCategory.parent !== undefined) {
            $scope.showCategories($scope.currentCategory.parent);
        } else {
            showRootCategory();
        }
    }


    $scope.showRootCategory = function showRootCategory() {
        $scope.doGetCategories($scope.connection, app.rootCategory, $scope.recursive, true);
        dataService.updateCurrentCategoryEvent(app.rootCategory);
    }

    $scope.showRootCategory();
});

app.controller('disFileUploadController', function ($scope, $fileUploader, disservice, dataService) {
    // Creates a uploader
    var uploader = $scope.uploader = $fileUploader.create({
        scope: $scope,
        url: app.baseUrl + '/file/' + app.disConnection + '/upload',
        formData: [
            { "fulcrum_Caption": '' }
        ]
    });


    // ADDING FILTERS

    // Images only
    //uploader.filters.push(function (item /*{File|HTMLInputElement}*/) {
    //    var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
    //    type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
    //    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    //});


    // REGISTER HANDLERS

    uploader.bind('afteraddingfile', function (event, item) {
        console.info('After adding a file', item);
    });

    uploader.bind('whenaddingfilefailed', function (event, item) {
        console.info('When adding a file failed', item);
    });

    uploader.bind('afteraddingall', function (event, items) {
        console.info('After adding all files', items);
    });

    uploader.bind('beforeupload', function (event, item) {
        console.info('Before upload', item);
    });

    uploader.bind('progress', function (event, item, progress) {
        //console.info('Progress: ' + progress, item);
    });

    uploader.bind('success', function (event, xhr, item, response) {
        disservice.assignItemToCategory(disservice.connection, response.id, disservice.categoryId);
        console.info('Success', xhr, item, response);
    });

    uploader.bind('cancel', function (event, xhr, item) {
        console.info('Cancel', xhr, item);
    });

    uploader.bind('error', function (event, xhr, item, response) {
        console.info('Error', xhr, item, response);
    });

    uploader.bind('complete', function (event, xhr, item, response) {
        console.info('Complete', xhr, item, response);
    });

    uploader.bind('progressall', function (event, progress) {
        //console.info('Total progress: ' + progress);
    });

    uploader.bind('completeall', function (event, items) {
        console.info('Complete all', items);
        dataService.refreshRecentFilesEvent({categoryId: disservice.categoryId, recursive: true, direction: 'descending'});
        //disservice.getRecentAssetsInCategory(disservice.categoryId, true, "descending");
    });
});

