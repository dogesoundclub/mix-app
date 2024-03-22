const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProvidePlugin } = require('webpack');

module.exports = {
  entry: {
    'bundle': './src/main.ts',
    __less: './docs/style/main.less',
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            url: false,
          }
        }, 'less-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.less'],
    fallback: {
      url: require.resolve("url/"),
      os: require.resolve("os-browserify/browser"),
      http: require.resolve("http-browserify"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert/"),
      crypto: require.resolve("crypto-browserify")
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    compress: true,
    port: 8080,
    open: true,
    proxy: {
      // RPC 요청을 위한 프록시 설정 추가
      '/api': {
        target: 'https://klaytn-pokt.nodies.app', // 대상 RPC 서버 URL
        changeOrigin: true, // true로 설정하여 origin 헤더를 target URL 호스트로 변경
        pathRewrite: {'^/api': ''}, // /api로 시작하는 경로를 공백으로 변경하여 실제 요청 경로 조정
      },
    },
  },
};
