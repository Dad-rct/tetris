const path = require('path');
const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);
// Get and check env variables
const buildRootPath = path.join(__dirname, "public", "js")
// Base config common to all tasks
const baseConfig = {
    mode: "development",
    target: "web",
    devtool: "cheap-module-source-map",
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 500, //otherwise insane cpu on mac . Can't seem to get it to use fsevents
        ignored: /node_modules/ //otherwise insane cpu on mac . Can't seem to get it to use fsevents
    },
    resolve: {
        extensions: [".mjs", ".ts", ".tsx", ".js"]
    },
    stats: "minimal",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: [/\.tsx?$/, /\.jsx?$/],
                include: [
                    path.resolve(__dirname, ".")
                ],
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    }
                ]
            }
        ]
    }
}

// Producer app (electron & web)
const Web = Object.assign({}, baseConfig, {
    target: "web",
    resolve: {
        extensions: [".mjs", ".ts", ".tsx", ".js"],
    },
    entry: path.join(__dirname, "src", "index.ts"),

    output: {
        publicPath: '../js/producer/',
        path: path.resolve(buildRootPath),
        hashFunction: "sha256"
    }
});


module.exports =
    Web
