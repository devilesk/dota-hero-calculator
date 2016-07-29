define(['rollbar', 'jquery'], function (Rollbar, $) {
    var rollbarConfig = {
      accessToken: 'de1980fcab4849d6a7a066cf098a6521',
      captureUncaught: true,
      payload: {
        environment: 'development',
        client: {
          javascript: {
            source_map_enabled: true,
            code_version: "283403e21f760e17dbd4b6a58ce59f9dfa8b682e",
            // Optionally have Rollbar guess which frames the error was thrown from
            // when the browser does not provide line and column numbers.
            guess_uncaught_frames: true
          }
        }
      }
    };
    
    var rollbar = Rollbar.init(rollbarConfig);
    
    var userActions = [];
    function addUserAction(o) {
        if (userActions.length > 10) {
            userActions.shift();
        }
        userActions.push(o);
    }
    
    function actionTrackWrapper(func, eventName) {
        return function() {
            var el = this;
            var data = {
                eventName: eventName
            };
            if (el.id) data.id = el.id;
            if (el.src) data.src = el.src;
            if (el.className) data.className = el.className;
            if (el.textContent) data.textContent = el.textContent;
            if (el.nodeName) data.nodeName = el.nodeName;
            if (el.getAttribute('data-bind')) data['data-bind'] = el.getAttribute('data-bind');
            addUserAction(data);
            return func.apply(this, arguments);
        }
    }
    
    function callbackWrap(object, property, argumentIndex, wrapperFactory, eventFilter) {
        var original = object[property];
        object[property] = function() {
            if (eventFilter.indexOf(arguments[0]) != -1) {
                arguments[argumentIndex] = wrapperFactory(arguments[argumentIndex], arguments[0]);
            }
            return original.apply(this, arguments);
        }
        return original;
    }
    
    callbackWrap(Element.prototype, "addEventListener", 1, actionTrackWrapper, ['click', 'focus', 'blur', 'change', 'dblclick']);
    
    return {
        rollbar: rollbar,
        userActions: userActions
    }
});