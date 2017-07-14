"use strict";

var getJSON = function (url, successCallback, errorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            successCallback(data);
        } else {
            // We reached our target server, but it returned an error
            errorCallback();
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        errorCallback();
    };

    request.send();
}

module.exports = getJSON;