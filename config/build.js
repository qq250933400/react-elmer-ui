const presets = [
    [
        "@babel/preset-env",   // 将ES6语法转换为es5
        {
            "useBuiltIns": "usage",    // 只编译需要编译的代码
            "corejs": "3.0.1",
        }
    ],
      "@babel/preset-react"
];

const plugins = [
    "@babel/plugin-syntax-dynamic-import",
    ["import", { "libraryName": "antd", "style": true }]
]

module.exports = { presets, plugins }