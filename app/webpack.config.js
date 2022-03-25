const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.join(__dirname,'./dist'),
    },
    devServer: { 
        contentBase: path.join(__dirname, "dist"), 
        compress: true, 
        port: 9000 },    
    plugins: [
        new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
      ]
};