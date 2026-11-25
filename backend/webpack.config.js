// Build de producción del backend con Webpack + Babel + Terser (Tema 13).
// Genera un único archivo minificado en dist/server.js listo para ejecutarse
// con `node dist/server.js`.
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    target: "node",
    entry: "./server.js",
    output: {
        filename: "server.js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: false, // conservamos logs estructurados de monitoreo
                        drop_debugger: true,
                        passes: 2
                    },
                    format: {
                        comments: false,
                        ascii_only: true
                    },
                    mangle: { safari10: true }
                },
                extractComments: false,
                parallel: true
            })
        ]
    },
    // Dependencias nativas que no deben empaquetarse
    externals: {
        bcryptjs: "commonjs bcryptjs"
    },
    stats: "minimal"
};
