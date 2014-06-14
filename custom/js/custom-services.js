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
        maxlength: 100,
        helptext: "Enter notes",
        errortext: "Notes cannot have more than 20 characters "
    };

    fields.uploaded_by = {
        value: "",
        displayname: "Uploaded By",
        damname: "Uploaded By",
        helptext: "",
        errortext: ""
    };

    fields.created_at = {
        value: "",
        displayname: "Created",
        damname: "Asset Creation Date",
        helptext: "",
        errortext: ""
    };

    fields.modified_at = {
        value: "",
        displayname: "Modified",
        damname: "Asset Modification Date",
        helptext: "",
        errortext: ""
    };

    fields.latitude = {
        value: "",
        displayname: "Latitude",
        damname: "Latitude",
        helptext: "",
        errortext: ""
    };

    fields.longitude = {
        value: "",
        displayname: "Longitude",
        damname: "Longitude",
        helptext: "",
        errortext: ""
    };


    return metadataService;
});
