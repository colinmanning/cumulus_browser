'use strict';

var app = angular.module('disBrowser');

app.factory('customMetadataService', function ($rootScope) {

    var metadataService = {};


    metadataService.setFormname = function (value) {
        formname = value;
    };

    metadataService.getFormname = function () {
        return formname;
    };

    metadataService.setFields = function (value) {
        fields = value;
    };

    metadataService.getFields = function () {
        return fields;
    };

    metadataService.setIsvalid = function (value) {
        isvalid = value;
    };

    metadataService.getIsvalid = function () {
        return isvalid;
    };

    metadataService.metadataVaildationEvent = function (data) {
        $rootScope.$broadcast("customMetadataVaildation", data);
    }


    metadataService.requestMetadatataEvent = function () {
        $rootScope.$broadcast("customRequestMetadata");
    }

    var formname = "metadataform";
    var isvalid = false;

    var fields = {};
    fields.caption = {
        value: "",
        displayname: "Caption",
        damname: "Caption",
        minlength: 3,
        helptext: "Enter caption",
        errortext: "Caption must be at least 3 characters"
    };
    fields.notes = {
        value: "",
        displayname: "Notes",
        damname: "Notes",
        maxlength: 20,
        helptext: "Enter notes",
        errortext: "Notes cannot have more than 20 characters "
    };

    return metadataService;
});
