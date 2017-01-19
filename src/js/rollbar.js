var Rollbar = require("rollbar-browser");

var rollbarConfig = {
    accessToken: "#rollbar_client_token",
    captureUncaught: true,
    payload: {
        environment: "#rollbar_environment",
        client: {
            javascript: {
                source_map_enabled: true,
                code_version: "#code_version",
                // Optionally have Rollbar guess which frames the error was thrown from
                // when the browser does not provide line and column numbers.
                guess_uncaught_frames: true
            }
        }
    }
};

var rollbar = Rollbar.init(rollbarConfig);

module.exports = rollbar;