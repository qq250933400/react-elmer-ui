const getCommand = require("elmer-common/lib/utils/index").getCommand;
const DefinePlugin = require("webpack").DefinePlugin;
const path = require("path");
module.exports = function override(config, env) {
    //do stuff with the webpack config...
    const envValue = getCommand(process.argv, "ENV");
    const overrideAlias = {
        ...(config.resolve?.alias || {}),
        "@MSJApp": path.resolve(process.cwd(), "./src/lib/MSJApp"),
        "@MSJApp/*": path.resolve(process.cwd(), "./src/lib/MSJApp/*"),
        "@Admin": path.resolve(process.cwd(), "./src/Admin"),
        "@Admin/*": path.resolve(process.cwd(), "./src/Admin/*")
    };
    return {
        ...config,
        plugins: [
            ...config.plugins,
            new DefinePlugin({
                ENV: JSON.stringify(envValue)
            })
        ],
        devServer: {
            port: "3001"
        },
        resolve: {
            ...config.resolve,
            alias: overrideAlias
        }
    };
};
