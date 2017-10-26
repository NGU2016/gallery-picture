var webpack =require('webpack')
var htmlWebpackPlugin=require('html-webpack-plugin');
module.exports={
    devtool: 'eval-source-map',
    entry:"./src/js/main.js",
    output:{
        path:__dirname+"/build",
        filename:"js/bundle.js"
    },
    module:{
        loaders:[
            {
                test:/\.(js|JSX)$/,
                exclude:/node_modules/,
                loader:"babel-loader"
            },{
                test:/\.scss/,
                loader:'style-loader!css-loader!autoprefixer-loader!sass-loader?outputStyle=expanded'
            },{
                test:/\.css$/,
                loader:'style-loader!css-loader!autoprefixer-loader'
            },{
                test:/\.json$/,
                loader:'json-loader'
            },{
                test:/\.(png|jpg)$/,
                loader:'url-loader?name=./imag/[hash:8].[ext]'
            }

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new htmlWebpackPlugin({
            template:'./src/index.html',
            filename: 'index.html',
            hash:false
        })
    ],
    devServer: {
        contentBase: "build",
        historyApiFallback: true,
        inline: true
    }

}