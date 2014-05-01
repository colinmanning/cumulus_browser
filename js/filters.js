'use strict';

var uploaderControllers = angular.module('uploaderControllers', []);
var app = angular.module('disBrowser');

app.filter('checkforempty', function () {
    return function (input) {
        var out = "<unset>";
        if (input && input != '' && input != " ") {
            out = input;
        }
        return out;
    };
});
