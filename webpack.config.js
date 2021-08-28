const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.tsx',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader'
			}
		]
	},
	devServer: {
		watchContentBase: true
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
		new CopyPlugin([ { from: './src/asset', to: '' } ])
	]
};
