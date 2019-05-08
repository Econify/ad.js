const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const configurations = [];

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
      new TerserPlugin({
        include: /\.min\.js$/
      })
    ],
  },

  // addition - add source-map support
  devtool: "source-map"
}

function createFile({ entry, filename, library }) {
  const fullEntryPath = `./src/${entry}`;

  configurations.push({
    ...config,
    entry: {
      [filename]: fullEntryPath,
      [`${filename}.min`]: fullEntryPath,
    },
    output: {
      path: path.resolve(__dirname, 'client'),
      filename: `adjs.[name].js`,
      library,
      libraryExport: 'default',
    },
  });
}

createFile({
  entry: 'index.ts',
  filename: 'main',
  library: 'AdJS',
});

createFile({
  entry: 'networks/DFP.ts',
  filename: 'networks.dfp',
  library: 'DFPNetwork',
});

createFile({
  entry: 'networks/Mock.ts',
  filename: 'networks.mock',
  library: 'MockNetwork',
});

createFile({
  entry: 'networks/Noop.ts',
  filename: 'networks.noop',
  library: 'NoopNetwork',
});

createFile({
  entry: 'plugins/Logging.ts',
  filename: 'plugins.log',
  library: 'LoggingPlugin',
});

createFile({
  entry: 'plugins/AutoRender.ts',
  filename: 'plugins.autorender',
  library: 'AutoRenderPlugin',
});

createFile({
  entry: 'plugins/AutoRefresh.ts',
  filename: 'plugins.autorefresh',
  library: 'AutoRefreshPlugin',
});

createFile({
  entry: 'plugins/Debug.ts',
  filename: 'plugins.debug',
  library: 'DebugPlugin',
});

createFile({
  entry: 'plugins/Sticky.ts',
  filename: 'plugins.sticky',
  library: 'StickyPlugin',
});

module.exports = configurations;
