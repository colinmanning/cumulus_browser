(function(){

var app = angular.module('disBrowser',['angularFileUpload', 'ui.bootstrap']);
app.baseUrl = "http://dis.berlinirish.com";
    app.disConnection = "sample-2";
    app.disView = "overview";
    app.rootCategory = { id: 1, path: "$Categories"};
    app.recentFileFetchInterval = 60;
    app.recentFileRefreshButtonShow = true;
    app.recentFileFetchCount = 10;

})();