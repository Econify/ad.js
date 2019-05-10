const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

const configurations = [];
const bundleFiles = ['./src/index'];

const config = {
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' } },
      { test: /\.(t|j)sx?$/, use: { loader: 'ts-loader' } },
      // addition - add source-map support
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ],
  },

  plugins: [
    new UnminifiedWebpackPlugin()
  ],

  // addition - add source-map support
  devtool: "source-map"
}

function createConfiguration({ type, files, basePath }) {
  const configuration = {
    ...config,
    entry: { },
    output: {
      path: path.resolve(__dirname, 'client'),
      filename: `adjs.${type}.[name].min.js`,
      library: ['_ADJS', type, '[name]'],
      libraryExport: 'default',
    }
  };

  files.forEach((file) => {
    const path = `${basePath}/${file}`;

    bundleFiles.push(path);

    configuration.entry[file] = path;
  });

  configurations.push(configuration);
}

createConfiguration({
  type: 'Plugins',
  basePath: './src/plugins',
  files: [
    'AutoRender',
    'AutoRefresh',
    'Debug',
    'GenericPlugin',
    'Logging',
    'Sticky',
  ]
});

createConfiguration({
  type: 'Networks',
  basePath: './src/networks',
  files: [
    'DFP',
    'Mock',
    'Noop',
  ]
});

// Core Build
configurations.push({
  ...config,
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'client'),
    filename: 'adjs.core.min.js',
    library: 'AdJS',
    libraryExport: 'default',
  },
});

module.exports = configurations;
