'use strict';

var uploaderControllers = angular.module('uploaderControllers', []);

uploaderControllers.controller('disUserController', function ($location, $scope, disservice, alertService, $cookies, $routeParams, authService) {
    $scope.cumulusUser = $routeParams.cu;
    $scope.user = {};
    $scope.failedLogins = 0;
    $scope.demoUser = {
        username: "demo53",
        firstname: "Demo",
        lastname: "User",
        email: "colin@printoutsource.com"
    }
    //$scope.loggedIn = false;

    $scope.doValidateUser = function doValidateUser(password) {

        disservice.validateUser(this.connection, $scope.cumulusUser, password).success(function (response) {
            $scope.failedLogins = 0;
            $scope.loggedIn = true;
            //$scope.user = response;
            $scope.user = $scope.demoUser.username;
            authService.setUserData($scope.demoUser);
            console.info("login successful");
            alertService.clear();
            authService.setSession(app.sessionDuration, $scope.cumulusUser);
            window.location = "#/upload";
        }).error(function (response) {
            $scope.failedLogins += 1;
            $scope.user = {};
            $scope.loggedIn = false;
            console.info("login failed");

            authService.logout();
            alertService.clear();
            alertService.add('danger', 'Failed login attempts: ' + $scope.failedLogins);
            authService.goToLoginPage();
        });
    }

    $scope.doLogout = function doLogout() {
        authService.logout();
        authService.goToLoginPage();
    }
});

uploaderControllers.controller('authController', function ($scope, authService) {
    if (!authService.isSessionAlive()) {
        authService.goToLoginPage();
    }
});


uploaderControllers.controller('alertController', function ($scope, alertService) {
    $scope.closeAlert = function (index) {
        alertService.closeAlert(index);
    };

});

uploaderControllers.controller('uploadAlertController', function ($scope, alertService) {
    $scope.closeAlert = function (index) {
        alertService.closeUploadAlert(index);
    };

});

uploaderControllers.controller('disAssetsController', function ($scope, $modal, disservice) {
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

    var doClear = function doClear() {
        this.searchText = '';
        $scope.assets = {};
        $scope.hasAssets = false;
    };

    //this.doTextSearch();

});

uploaderControllers.controller('disRecentAssetsController', function ($scope, $modal, $interval, disservice) {
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
        var previewModalInstance = $modal.open({
            templateUrl: 'partials/dis-asset-preview.html',
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


uploaderControllers.controller('disPreviewInstanceController', function ($scope, $modalInstance, asset) {

    $scope.asset = asset;

    $scope.ok = function () {
        $modalInstance.close($scope);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

uploaderControllers.controller('disCategoryBreadcrumbsController', function ($scope, disservice, dataService) {
    $scope.currentCategory = app.rootCategory;

    $scope.$on("updateCurrentCategory", function (event, args) {
        $scope.currentCategory = args;
    });
});

uploaderControllers.controller('disCategoryController', function ($scope, disservice, dataService, authService) {
    $scope.category = {};
    $scope.recursive = false;

    $scope.connection = app.disConnection;
    $scope.categoryId = -1;
    $scope.recursive = 'false';
    $scope.isRoot = true;
    $scope.currentCategory = undefined;
    $scope.categories = [];

    $scope.doGetCategories = function doGetCategories(connection, category, recursive, isRoot) {

        if (!authService.isSessionAlive()) {
            authService.goToLoginPage();
        }
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


    $scope.refreshCurrentCategory = function refreshCurrentCategory() {
        if ($scope.currentCategory !== undefined) {
            $scope.showCategories($scope.currentCategory);
        }
    }


    $scope.showRootCategory = function showRootCategory() {
        $scope.doGetCategories($scope.connection, app.rootCategory, $scope.recursive, true);
        dataService.updateCurrentCategoryEvent(app.rootCategory);
    }

    $scope.showRootCategory();
});

uploaderControllers.controller('disFileUploadController', function ($scope, $rootScope, $modal, $q, $fileUploader, disservice, dataService, authService, alertService, customMetadataService) {
    $scope.uploadMetadata = [];
    $scope.enableMtadata = app.enableMtadata;
    $scope.canUpload = false;
    $scope.metadataIsValid = customMetadataService.getIsvalid();


    $scope.setupAlerts = function setupAlerts() {
        alertService.clearUploadAlerts();
        if (!$scope.metadataIsValid) {
            alertService.addUploadAlert('danger', app.error_invalidMetadata);
        }
        $scope.checkCanUpload();
    }

    $scope.$on('customMetadataVaildation', function (event, args) {
        $scope.metadataIsValid = customMetadataService.getIsvalid();
        $scope.setupAlerts();
    });

    // Creates an uploader
    var uploader = $scope.uploader = $fileUploader.create({
        scope: $scope,
        url: app.baseUrl + '/file/' + app.disConnection + '/upload'
    });

    $scope.$on("updateCurrentCategory", function (event, args) {
        $scope.uploader.clearQueue();
    });

    $scope.startUpload = function startUpload() {
        $scope.setupUploadMetadata(customMetadataService.getFields());
        $scope.uploader.uploadAll();
    }

    $scope.setupUploadMetadata = function setupUploadMetadata(fields) {
        $scope.uploadMetadata = {};
        var fvs = _.values(fields);
        for (var i = 0; i < fvs.length; i++) {
            var field = {};
            $scope.uploadMetadata[fvs[i].damname] = fvs[i].value;
        }
        ;
        try {
            var u = authService.getUserData();
            $scope.uploadMetadata["Uploaded By"] = u.firstname + " " + u.lastname;
        } catch (e) {
            alert("Error: Session terminated, please login again");
            authService.goToLoginPage();
        }
    };

    // Register handlers
    uploader.bind('afteraddingfile', function (event, item) {
        //console.info('After adding a file', item);
        $scope.checkCanUpload();
    });

    uploader.bind('whenaddingfilefailed', function (event, item) {
        //console.info('When adding a file failed', item);
    });

    uploader.bind('afteraddingall', function (event, items) {
        //console.info('After adding all files', items);
        $scope.checkCanUpload();
    });

    uploader.bind('beforeupload', function (event, item) {
        console.info('Before upload', item);
        if (!authService.isSessionAlive()) {
            authService.goToLoginPage();
        }

    });


    uploader.bind('progress', function (event, item, progress) {
        //console.info('Progress: ' + progress, item);
        $scope.checkCanUpload();
    });

    uploader.bind('success', function (event, xhr, item, response) {
        //$scope.checkCanUpload();
        disservice.postMetadata(disservice.connection, response.id, $scope.uploadMetadata).then(function () {
            return disservice.assignItemToCategory(disservice.connection, response.id, disservice.categoryId)
        }).then(function () {
            dataService.refreshRecentFilesEvent({categoryId: disservice.categoryId, recursive: true, direction: 'descending'});
        });
        console.info('Success', xhr, item, response);
    });

    uploader.bind('cancel', function (event, xhr, item) {
        $scope.checkCanUpload();
        console.info('Cancel', xhr, item);
    });

    uploader.bind('error', function (event, xhr, item, response) {
        $scope.checkCanUpload();
        console.info('Error', xhr, item, response);
    });

    uploader.bind('complete', function (event, xhr, item, response) {
        $scope.checkCanUpload();
        console.info('Complete', xhr, item, response);
    });

    uploader.bind('progressall', function (event, progress) {
        $scope.checkCanUpload();
        //console.info('Total progress: ' + progress);
    });

    uploader.bind('completeall', function (event, items) {
        $scope.checkCanUpload();
        console.info('Complete all', items);
    });

    $scope.checkCanUpload = function () {
        $scope.canUpload = ($scope.uploader.queue.length && $scope.uploader.getNotUploadedItems().length && $scope.metadataIsValid);
    }

});

