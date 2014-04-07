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
    this.connection = 'sample-2';
    this.view = 'overview';
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
            templateUrl: 'dis-asset-preview.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return asset;
                }
            }
        });

        modalInstance.result.then(function(){
            //on ok button press
        },function(){
            //on cancel button press
        });

    };

    this.doClear = function doClear() {
        this.searchText = '';
        $scope.assets = {};
        $scope.hasAssets = false;
    };

    //this.doTextSearch();

});

app.controller('disRecentAssetsController', function ($scope, $modal, disservice) {
    $scope.assets = {};
    $scope.connection = 'sample-2';
    $scope.view = 'overview';
    $scope.hasAssets = false;
    $scope.currentAsset = {}
    $scope.totalItems = 64;


    $scope.getRecentAssetsInCategory = function getRecentAssetsInCategory(categoryId, recursive, direction) {
        disservice.getRecentAssetsInCategory($scope.connection, $scope.view, categoryId, recursive, direction).success(function (response) {
            $scope.assets = response;
            $scope.totalItems = $scope.assets.total;
            $scope.hasAssets = ($scope.assets.total > 0);
        }).error(function (response) {
            this.doClear();
        });
    };

    $scope.doPreview = function doPreview(asset) {
        $scope.currentAsset = asset;
        var modalInstance = $modal.open({
            templateUrl: 'dis-asset-preview.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return asset;
                }
            }
        });

        modalInstance.result.then(function(){
            //on ok button press
        },function(){
            //on cancel button press
        });

    };

    this.doClear = function doClear() {
        this.searchText = '';
        $scope.assets = {};
        $scope.hasAssets = false;
    };

    if(!disservice.categoryId) {
        disservice.categoryId = app.rootCategory.id;
    }

    $scope.$on ("myEvent", function (event, args) {
        $scope.getRecentAssetsInCategory(args.categoryId, args.recursive, args.direction);
    });

    $scope.getRecentAssetsInCategory(disservice.categoryId, true, "descending");

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

app.controller('disCategoryController', function ($scope, disservice, dataService) {
    $scope.category = {};
    $scope.recursive = false;

    $scope.catTreeArray = [1];
    $scope.connection = 'sample-2';
    $scope.parentCategoryId = 1;
    $scope.currentCategoryPath = "";
    this.superParentCategoryId = app.rootCategory.id;
    $scope.categoryId = 1;
    $scope.recursive = 'false';

    $scope.doGetCategories = function doGetCategories(connection, categoryId, recursive, isRoot) {
 //           $scope.categoryId = categoryId
            disservice.getCategories(connection, categoryId, recursive, isRoot).success(function (response) {
                if (!isRoot) {
                    $scope.currentCategoryPath = $scope.currentCategoryPath + ":" + response.name;
                }
                $scope.categoryId = response.id;
                $scope.hasSubcategories = (response.hasChildren == true);
                if($scope.hasSubcategories) {
                    if($scope.catTreeArray.indexOf(categoryId) == -1) {
                        var parentIdIndex = $scope.catTreeArray.indexOf($scope.parentCategoryId);
                        if($scope.catTreeArray.length>parentIdIndex) {
                            $scope.catTreeArray[parentIdIndex+1] = categoryId;
                        }
                        else {
                            $scope.catTreeArray.push(categoryId);
                        }
                        $scope.superParentCategoryId = $scope.parentCategoryId;
                        $scope.parentCategoryId = categoryId;
                    } else {
                        var catIdIndex = $scope.catTreeArray.indexOf(categoryId);
                        if (catIdIndex==1 || catIdIndex==0 ) {
                            $scope.parentCategoryId = $scope.catTreeArray[0];
                            $scope.superParentCategoryId = $scope.parentCategoryId;
                        }
                        if (catIdIndex>1) {
                            $scope.parentCategoryId = categoryId; //$scope.catTreeArray[catIdIndex-1];
                            $scope.superParentCategoryId =  $scope.catTreeArray[catIdIndex-1]; //$scope.catTreeArray[catIdIndex-2];
                        }
                    }
                    $scope.categories = response.subcategories;
                    dataService.broadcastData({categoryId: disservice.categoryId, recursive: true, direction: 'descending'});
            }
        });
    };

    $scope.showCategories = function showCategories(categoryId) {
        $scope.doGetCategories($scope.connection, categoryId, $scope.recursive, false);
    }

    $scope.showRootCategory = function showRootCategory() {
        $scope.currentCategoryPath = app.rootCategory.path;
        $scope.doGetCategories($scope.connection, app.rootCategory.id, $scope.recursive, true);
        $scope.currentCategoryPath = app.rootCategory.path;
    }

    $scope.showRootCategory();
});

app.controller('disFileUploadController', function ($scope, $fileUploader, disservice, dataService) {
    // Creates a uploader
    var uploader = $scope.uploader = $fileUploader.create({
        scope: $scope,
        url: 'http://dis.berlinirish.com/file/sample-1/upload',
        formData: [
            { "fulcrum_Caption": 'Colin testing stuff' }
        ]
    });


    // ADDING FILTERS

    // Images only
    uploader.filters.push(function (item /*{File|HTMLInputElement}*/) {
        var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
        type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    });


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
        console.info('Progress: ' + progress, item);
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
        console.info('Total progress: ' + progress);
    });

    uploader.bind('completeall', function (event, items) {
        console.info('Complete all', items);
        dataService.broadcastData({categoryId: disservice.categoryId, recursive: true, direction: 'descending'});
        //disservice.getRecentAssetsInCategory(disservice.categoryId, true, "descending");
    });
});

