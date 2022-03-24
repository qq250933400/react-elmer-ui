const getCommand = require("elmer-common/lib/utils/index").getCommand;
const DefinePlugin = require("webpack").DefinePlugin;
module.exports = function override(config, env) {
    //do stuff with the webpack config...
    const envValue = getCommand(process.argv, "ENV");
    const overrideAlias = {
        ...(config.resolve?.alias || {}),
        "MSJApp": "./src/lib/MSJApp",
        "MSJApp/*": "./src/lib/MSJApp/*"
    };
    console.log(config);
    console.log(overrideAlias);
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
