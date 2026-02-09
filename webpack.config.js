const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
      clean: true,
      publicPath: ''  // 改为相对路径，适应Vercel部署
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new Dotenv({
        path: isProduction ? './.env.production' : './.env.development',
        safe: true,
        allowEmptyValues: true,
        systemvars: true,
        silent: false,
        defaults: false
      })
    ],
    devServer: {
      port: 8080,
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.js', '.vue', '.json']
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          }
        }
      }
    }
  };
};