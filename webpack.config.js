const path = require('path');

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
  // addition - add source-map support
  devtool: "source-map"
}

function createFile({ entry, filename, library }) {
  configurations.push({
    ...config,
    entry: `./src/${entry}`,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `adjs.${filename}.js`,
      library,
      libraryExport: 'default',
    }
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
  entry: 'plugins/Debug.ts',
  filename: 'plugins.debug',
  library: 'DebugPlugin',
});

module.exports = configurations;
