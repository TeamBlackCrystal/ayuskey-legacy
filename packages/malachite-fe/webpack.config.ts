/**
 * webpack configuration
 */

import * as fs from 'node:fs';
import * as webpack from 'webpack';
import { execSync } from 'node:child_process';
const { VueLoaderPlugin } = require('vue-loader');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');

class WebpackOnBuildPlugin {
	constructor(readonly callback: (stats: any) => void) {
	}

	public apply(compiler: any) {
		compiler.hooks.done.tap('WebpackOnBuildPlugin', this.callback);
	}
}

const isProduction = process.env.NODE_ENV == 'production';
const isTesting = process.env.RK_MODE == 'testing';
let gitHash;

const constants = require('./src/const.json');

// FIXME: todo
const locales = require('../../locales');
const meta = require('./package.json');
const codename = meta.codename;
if (!isProduction || isTesting) gitHash = execSync('git rev-parse HEAD').toString().replace(/\r?\n/g, '').slice(0, 8);
//const version = isProduction ? isTesting ? meta.version + '-' + rndstr({ length: 8, chars: '0-9a-z' }) : meta.version : meta.version + '-' + rndstr({ length: 8, chars: '0-9a-z' });
const version = isProduction ? isTesting ? meta.version + '-' + gitHash : meta.version : meta.version + '-' + gitHash;
//const version = isProduction ? meta.version : meta.version + '-' + rndstr({ length: 8, chars: '0-9a-z' });

const postcss = {
	loader: 'postcss-loader',
	options: {
		postcssOptions: {
			plugins: [
				require('cssnano')({
					preset: 'default'
				})
			]
		}
	},
};

module.exports = {
	entry: {
		desktop: './src/app/desktop/script.ts',
		mobile: './src/app/mobile/script.ts',
		// ↓Deprecated
		dev: './src/app/dev/script.ts',
		auth: './src/app/auth/script.ts',
		admin: './src/app/admin/script.ts',
		sw: './src/app/sw/sw.js'
	},
	module: {
		rules: [{
			test: /\.vue$/,
			exclude: /node_modules/,
			use: [{
				loader: 'vue-loader',
				options: {
					scss: 'vue-style-loader!css-loader!sass-loader',
					sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
					cssSourceMap: false,
					compilerOptions: {
						preserveWhitespace: false
					}
				}
			}, {
				loader: 'vue-svg-inline-loader'
			}]
		}, {
			test: /\.styl(us)?$/,
			exclude: /node_modules/,
			oneOf: [{
				resourceQuery: /module/,
				use: [{
					loader: 'vue-style-loader'
				}, {
					loader: 'css-loader',
					options: {
						modules: true,
						esModule: false,
						url: false,
					}
				}, postcss, {
					loader: 'stylus-loader'
				}]
			}, {
				use: [{
					loader: 'vue-style-loader'
				}, {
					loader: 'css-loader',
					options: {
						url: false,
						esModule: false
					}
				}, postcss, {
					loader: 'stylus-loader'
				}]
			}]
		}, {
			test: /\.css$/,
			use: [{
				loader: 'vue-style-loader'
			}, {
				loader: 'css-loader',
				options: {
					esModule: false,
				}
			}, postcss]
		}, {
			test: /\.(eot|woff|woff2|svg|ttf)([?]?.*)$/,
			loader: 'url-loader'
		}, {
			test: /\.json5$/,
			loader: 'json5-loader',
			options: {
				esModule: false,
			},
			type: 'javascript/auto'
		}, {
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: 'ts-loader',
				options: {
					happyPackMode: true,
					configFile: __dirname + '/tsconfig.build.json',
					appendTsSuffixTo: [/\.vue$/]
				}
			}]
		}, {
			test: /\.scss?$/,
			exclude: /node_modules/,
			oneOf: [{
				resourceQuery: /module/,
				use: [{
					loader: 'vue-style-loader'
				}, {
					loader: 'css-loader',
					options: {
						modules: true,
						esModule: false, // TODO: trueにすると壊れる。Vue3移行の折にはtrueにできるかもしれない
						url: false,
					}
				}, postcss, {
					loader: 'sass-loader',
					options: {
						implementation: require('sass'),
						sassOptions: {
							fiber: false
						}
					}
				}]
			}, {
				use: [{
					loader: 'vue-style-loader'
				}, {
					loader: 'css-loader',
					options: {
						url: false,
						esModule: false, // TODO: trueにすると壊れる。Vue3移行の折にはtrueにできるかもしれない
					}
				}, postcss, {
					loader: 'sass-loader',
					options: {
						implementation: require('sass'),
						sassOptions: {
							fiber: false
						}
					}
				}]
			}]
		}]
	},
	plugins: [
		new WebpackBar({
			name: 'Ayuskey FE'
		}),
		new webpack.DefinePlugin({
			_COPYRIGHT_: JSON.stringify(constants.copyright),
			_VERSION_: JSON.stringify(version),
			_CODENAME_: JSON.stringify(codename),
			_LANGS_: JSON.stringify(Object.entries(locales).map(([k, v]: [string, any]) => [k, v && v.meta && v.meta.lang])),
			_ENV_: JSON.stringify(process.env.NODE_ENV)
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
		}),
		new WebpackOnBuildPlugin((stats: any) => {
			fs.writeFileSync('./built/meta.json', JSON.stringify({ version }), 'utf-8');

			fs.mkdirSync('./built/assets/locales', { recursive: true });

			for (const [lang, locale] of Object.entries(locales))
				fs.writeFileSync(`./built/assets/locales/${lang}.json`, JSON.stringify(locale), 'utf-8');
		}),
		new VueLoaderPlugin()
	],
	output: {
		path: __dirname + '/built/assets',
		filename: `[name].${version}.js`,
		publicPath: `/assets/`
	},
	resolve: {
		extensions: [
			'.js', '.ts', '.json'
		],
		alias: {
			'@client': __dirname + '/src/app',
			'@': __dirname + '/src',
			'const.styl': __dirname + '/src/const.styl',
			'@misc': __dirname + '/../../src/misc',
			'@prelude': __dirname + '/../../src/prelude',
			'@mfm': __dirname + '/../../src/mfm',
			'@games': __dirname + '/../../src/games',

		}
	},
	resolveLoader: {
		modules: ['node_modules']
	},
	optimization: {
		minimizer: [new TerserPlugin({
			parallel: 1
		})]
	},
	devtool: false, //'source-map',
	mode: isProduction ? 'production' : 'development'
};
