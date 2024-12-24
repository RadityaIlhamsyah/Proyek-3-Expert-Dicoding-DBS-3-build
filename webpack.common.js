const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'images/[name][ext]', // This will output images to the images folder
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource', // Use webpack 5's built-in asset module
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/templates/index.html'),
      favicon: path.resolve(__dirname, 'src/public/images/icon.png'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
          globOptions: {
            ignore: ['**/images/**/*.md'],
          },
        },
      ],
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: './sw.js',
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://restaurant-api.dicoding.dev/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'GANTI_DENGAN_NAMA_CACHE_MU',
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@scripts': path.resolve(__dirname, 'src/scripts/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@public': path.resolve(__dirname, 'src/public/'),
      '@data': path.resolve(__dirname, 'src/scripts/data/'),
      '@utils': path.resolve(__dirname, 'src/scripts/utils/'),
      '@views': path.resolve(__dirname, 'src/scripts/views/'),
      '@components': path.resolve(__dirname, 'src/scripts/components/'),
      '@routes': path.resolve(__dirname, 'src/scripts/routes/'),
      '@services': path.resolve(__dirname, 'src/scripts/services/'),
      '@helpers': path.resolve(__dirname, 'src/scripts/helpers/'),
      '@templates': path.resolve(__dirname, 'src/templates/'),
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
