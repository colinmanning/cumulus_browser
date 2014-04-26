'use strict';

var uploaderControllers = angular.module('uploaderControllers');

uploaderControllers.controller('customMetadataController', function ($scope, dataService, customMetadataService) {

    $scope.fields = customMetadataService.getFields();
    $scope.formname = customMetadataService.getFormname();
    $scope.isvalid = customMetadataService.getIsvalid();

    $scope.$watch('metadataform.$valid', function (newValue, oldValue) {
        //if (newValue === oldValue) return;
        $scope.isvalid = newValue;
        customMetadataService.setIsvalid(newValue);
        customMetadataService.metadataVaildationEvent($scope.isvalid);
    });

    $scope.$on("customRequestMetadata", function (event, args) {
        customMetadataService.setIsvalid($scope.isvalid);
        customMetadataService.setFields($scope.fields);
        customMetadataService.setFormname($scope.formname);
    });


    $scope.metadataEditDone = function () {
        $modalInstance.close($scope);
    };

    $scope.metadataEditCancelled = function () {
        $modalInstance.dismiss('cancel');
    };

});
