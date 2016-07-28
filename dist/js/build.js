{
    appDir: "../",
    baseUrl: "js",
    dir: "../../www-build",
    packages: ["herocalc", "components"],
    mainConfigFile: "main.js",
    onBuildWrite   : function(name, path, contents) {
        console.log('Writing: ' + name);
        if (name === 'main') {
            // output the original source contents
            console.log(contents);
            // perform transformations on the original source
            contents = contents.replace(/#DEV_BUILD/, new Date().toString());
            contents = contents.replace(/development/, 'production');
            // output the processed contents
            console.log(contents);
        }
        // return contents
        return contents;
    },
    modules: [
        {
            name: "main"
        }
    ]
}