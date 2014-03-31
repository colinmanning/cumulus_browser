var app = angular.module('disBrowser');

app.directive('disKeyEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.disKeyEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

app.constant('disKeyCodes', {
    esc: 27,
    space: 32,
    enter: 13,
    tab: 9,
    backspace: 8,
    shift: 16,
    ctrl: 17,
    alt: 18,
    capslock: 20,
    numlock: 144
});

app.directive('disKeyBind', ['disKeyCodes', function (keyCodes) {
    function map(obj) {
        var mapped = {};
        for (var key in obj) {
            var action = obj[key];
            if (keyCodes.hasOwnProperty(key)) {
                mapped[keyCodes[key]] = action;
            }
        }
        return mapped;
    }

    return function (scope, element, attrs) {
        var bindings = map(scope.$eval(attrs.disKeyBind));
        element.bind("keydown keypress", function (event) {
            if (bindings.hasOwnProperty(event.which)) {
                scope.$apply(function () {
                    scope.$eval(bindings[event.which]);
                });
            }
        });
    };
}]);