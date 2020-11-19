const path = require('path');
const angular = require('../angular.json');
const webpack = require('webpack');
module.exports = {
    mode: 'none',
    entry: {
        content:`${__dirname}/content.ts`,
        background:`${__dirname}/background.ts`
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use:  `ts-loader?configFile=${__dirname}/tsconfig.chrome.json`,
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dist', angular.defaultProject)
    },
    
    stats: 'normal'
};
