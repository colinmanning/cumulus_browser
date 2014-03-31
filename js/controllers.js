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
            if ($scope.totalItems > $scope.pageSize)
                $scope.showPager = true;
            else
                $scope.showPager = false;
            $scope.hasAssets = ($scope.assets.total > 0);
        }).error(function (response) {
            this.doClear();
        });
    };

    $scope.doSelectPage = function doSelectPage(pageNo) {

    }

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
    }

    //this.doTextSearch();

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

app.controller('disCategoryController', function ($scope, disservice) {
    $scope.category = {};
    $scope.recursive = false;
});

app.controller('disFileUploadController', function ($scope, $fileUploader, disservice) {
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
    });
});

