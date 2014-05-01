'use strict';

var uploaderControllers = angular.module('uploaderControllers');

uploaderControllers.controller('customMetadataController', function ($scope, dataService, customMetadataService) {

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
