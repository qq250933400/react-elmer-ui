const getCommand = require("elmer-common/lib/utils/index").getCommand;
const DefinePlugin = require("webpack").DefinePlugin;
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = function override(config, env) {
    //do stuff with the webpack config...
    const envValue = getCommand(process.argv, "ENV");
    const overrideAlias = {
        ...(config.resolve?.alias || {}),
        "@MSJApp": path.resolve(process.cwd(), "./src/lib/MSJApp"),
        "@MSJApp/*": path.resolve(process.cwd(), "./src/lib/MSJApp/*"),
        "@Admin": path.resolve(process.cwd(), "./src/Admin"),
        "@Admin/*": path.resolve(process.cwd(), "./src/Admin/*"),
        "@Component": path.resolve(process.cwd(), "./src/components"),
        "@Component/*": path.resolve(process.cwd(), "./src/components/*"),
        "@HOC": path.resolve(process.cwd(), "./src/HOC"),
        "@HOC/*": path.resolve(process.cwd(), "./src/HOC/*"),
    };
    console.log(config);
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
        entry: {
            "main": path.resolve(__dirname, "./src/index.tsx"),
            "main.min": path.resolve(__dirname, "./src/index.tsx"),
        },
        // mode: "none", //因为自带的只能指定一种环境，所以我们直接关闭，利用插件实现
        // optimization: { //这个字段很强大，我们做webpack的代码分割，摇数，tree shake等都会用到这个字段
        //     minimize: true, //开启插件
        //     minimizer: [
        //         new TerserPlugin({
        //             test: /\.min.js/
        //         })
        //     ]
        // }
    };
};
