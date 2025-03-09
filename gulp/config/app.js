import { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import pugbem from 'gulp-pugbem';
import TerserPlugin from 'terser-webpack-plugin';

const isProd = process.argv.includes('--production');
const isDev = !isProd;

export const app = {
	isProd: isProd,
	isDev: isDev,

	webpack: {
		// mode: isProd ? 'production' : 'development',
		mode: 'production',
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						keep_fnames: true, // сохраняем имена функций
						keep_classnames: true, // сохраняем имена классов
						format: {
							comments: false,
						},
					},
					extractComments: false,
				}),
			],
			runtimeChunk: 'single',
		},

		entry: {
			app: { import: ['./#src/js/app.js'] },
			main: {
				import: ['./#src/js/main.js'],
				// dependOn: ['anime-vendors'],
				// filename: '[name].min.js'
			},
			// dinamic: { import: ['./#src/js/assets/dynamic.js'] },
			index: {
				import: ['./#src/js/pages/index.jsx'],
				// dependOn: ['react-vendors', 'anime-vendors', 'swiper-bundle'],
				// filename: '[name].min.js'
			},
			//! depend On - vendors
			// 'react-vendors': {
			// 	import: ['react', 'react-dom', 'react-router-dom', 'prop-types'],
			// 	filename: 'vendors/[name].min.js',
			// },

			// 'anime-vendors': {
			// 	import: ['gsap', 'gsap/ScrollSmoother', 'gsap/ScrollTrigger'],
			// 	filename: 'vendors/[name].min.js',
			// },

			// 'swiper-bundle': {
			// 	import: ['swiper/bundle'],
			// 	filename: 'vendors/[name].min.js',
			// },

			// 'video-vendors': {
			// 	import: ['video.js'], // Название для отдельного chunks
			// },
		},
		// output: {
		// 	filename: '[name].min.js',
		// },
		output: {
			filename: (pathData) => {
				// Проверяем имя chunk
				if (pathData.chunk.name === 'runtime') {
					return 'vendors/[name].min.js'; // runtime попадает в vendors/
				}
				return '[name].min.js'; // Остальные файлы остаются в текущем формате
			},
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: ['babel-loader'],
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						'style-loader',
						'css-loader',
						{
							loader: 'sass-loader',
							options: {
								api: 'modern-compiler',
								sassOptions: {
									// Your sass options
								},
							},
						}
					],
				},
				// {
				// 	test: /\.scss$/,
				// 	exclude: /node_modules/,
				// 	use: [
				// 		'style-loader',
				// 		'css-loader',
				// 		'sass-loader'   // компилирует Sass в CSS
				// 	]
				// },
			],
		},
		resolve: {
			extensions: ['.js', '.jsx'],
			// разрешаем импорт файлов с расширениями .js и .jsx
		},
	},

	scss: {
		outputStyle: 'expanded',
		silenceDeprecations: ['legacy-js-api'],
		api: 'modern-compiler',
		options: {
			sassOptions: {
				quietDeps: false,
			},
		},
	},
	pug: {
		pretty: true,
		plugins: [pugbem]
	},
	htmlMin: {
		collapseWhitespace: true
	},
	renameScss: {
		extname: '.css',
		suffix: '.min',
	},
	csso: {
		restructure: true,
		sourceMap: true
	},
	autoprefixer: {
		cascade: false,
		grid: 'auto-place',
		overrideBrowserslist: [
			'Android >= 4',
			'last 3 versions',
			'Firefox >= 24',
			'Safari >= 6',
			'Opera >= 12'
		]
	},
	fonter: {
		// formats: ['ttf', 'woff', 'eot', 'svg'],

		formats: ['ttf', 'woff', 'svg'],
	},
	svgMin: {
		js2svg: {
			indent: 4,
			pretty: true
		}
	},
	cheerio: {
		run: function ($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
		},
		parserOptions: { xmlMode: true }
	},
	svgSprite: {
		shape: {
			id: {
				separator: '--',
				pseudo: '~',
				whitespace: '_'
			},
			dimension: { // Set maximum dimensions
				maxWidth: 500,
				maxHeight: 500
			},
			spacing: { // Add padding
				padding: 0
			},
			transform: [{
				svgo: {
					plugins: [
						'cleanupAttrs',
						'convertColors',
						'removeEmptyAttrs'
					]
				}
			}],
		},
		mode: {
			defs: {
				dest: './',
				sprite: './sprite.svg',
			},
		},
	},
	imageMin: (
		[
			svgo({
				plugins: [
					{ optimizationLevel: 5 },
					{ progessive: true },
					{ interlaced: true },
					{ removeViewBox: false },
					{ removeUselessStrokeAndFill: false },
					{ cleanupIDs: false }
				],
			}),
			gifsicle({ interlaced: true }),
			optipng({ optimizationLevel: 3 }),
			mozjpeg({ quality: 75, progressive: true }),
		]),
	include: {
		prefix: '@@',
		basepath: '@#src'
	},
}; 