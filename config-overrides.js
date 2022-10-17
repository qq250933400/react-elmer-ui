const getCommand = require("elmer-common/lib/utils/index").getCommand;
const DefinePlugin = require("webpack").DefinePlugin;
const path = require("path");

module.exports = function override(config, env) {
    //do stuff with the webpack config...
    const envValue = getCommand(process.argv, "ENV");
    const overrideAlias = {
        ...(config.resolve?.alias || {}),
        "@Component": path.resolve(process.cwd(), "./src/components"),
        "@Component/*": path.resolve(process.cwd(), "./src/components/*"),
        "@HOC": path.resolve(process.cwd(), "./src/HOC"),
        "@HOC/*": path.resolve(process.cwd(), "./src/HOC/*"),
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
        },
        output: {
            ...config.output,
            filename: "[name].js",
            library: "react-common-ui",
            libraryTarget: "umd",
        },
        externals: {
            'react': 'react',
            'react-dom': 'react-dom'
        }
    };
};
