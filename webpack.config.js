const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

const PATHS = {
  current: __dirname,
  src: path.join(__dirname, "src"),
  static: path.join(__dirname, "static"),
};

// noinspection WebpackConfigHighlighting
module.exports = {
  mode: "development",
  entry: {
    app: path.join(PATHS.src, "index.tsx")
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: '[name].bundle.js',
    path: PATHS.static
  },
  devServer: {
    contentBase: PATHS.static
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: "ts-loader",
          options: {
            configFile: path.join(__dirname, "tsconfig.json")
          }
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new MiniCssExtractPlugin(),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})
    })
  ],
};