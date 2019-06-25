// rollup.config.js
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const typescript = require('rollup-plugin-typescript');
const terser = require("rollup-plugin-terser").terser;
const templateLiteralIndentFix = require('./rollup-plugins/template-literal-indent-fix');
const productionPruning = require('./rollup-plugins/production-pruning');
const { version } = require('./package.json');

const BUILD_DIR = 'build';

const WEB_FORMAT = 'iife';
const NODE_FORMAT = 'cjs';

const SOURCEMAP = true;
const SOURCEMAP_IN_PRODUCTION = false;
const INDENT = false;

const BASE_PLUGINS = [
  typescript(),
  replace({ __VERSION__: version }),
  nodeResolve(),
  commonjs(),
  templateLiteralIndentFix(),
];

const configurations = [];

// { type, files, basePath  }
function createConfigurations(options) {
  const { files, basePath, ...baseOptions } = options;

  files.forEach((file) => {
    const path = `${basePath}/${file}.ts`;

    const fileOptions = { ...baseOptions, file, path };

    createConfiguration(fileOptions);
  });
}

// { type, file, path }
function createConfiguration(options) {
  const developmentWebConfiguration = createDevelopmentConfiguration(options);
  const productionWebConfiguration = createProductionConfiguration(options);
  const nodeConfiguration = createNodeConfiguration(options);

  configurations.push(
    developmentWebConfiguration,
    productionWebConfiguration,
    nodeConfiguration
  );
}

function createNodeConfiguration({ type, file, path }) {
  const outputFile = `./${BUILD_DIR}/${type}/${file}.js`;

  const configuration = {
    input: path,
    plugins: [
      ...BASE_PLUGINS,
    ],
    output: {
      file: outputFile,
      format: NODE_FORMAT,
    },
  };

  if (!type) {
    configuration.output.file = `./${BUILD_DIR}/${file}.js`;
  }

  return configuration;
}

function createDevelopmentConfiguration({ type, file, path, name }) {
  const outputFile = `./${BUILD_DIR}/umd/${type}.${file}.development.js`.toLowerCase();

  const configuration = {
    input: path,
    plugins: [
      ...BASE_PLUGINS,
    ],
    output: {
      file: outputFile,
      format: WEB_FORMAT,

      name: `_ADJS.${type}.${file}`,

      indent: INDENT,
      sourcemap: SOURCEMAP,
    },
  };

  if (name) {
    configuration.output.name = name;
  }

  if (!type) {
    configuration.output.file = `./${BUILD_DIR}/umd/${file}.development.js`;
  }

  return configuration;
}

function createProductionConfiguration({ type, file, path, name, prune = true }) {
  const configuration = {
    input: path,
    plugins: [
      ...BASE_PLUGINS,
      prune ? productionPruning() : null,
      terser(),
    ],
    output: {
      file: `./${BUILD_DIR}/umd/${type}.${file}.production.min.js`.toLowerCase(),
      name: `_ADJS.${type}.${file}`,

      format: WEB_FORMAT,

      indent: INDENT,
      sourcemap: SOURCEMAP_IN_PRODUCTION,
    },
  };

  if (name) {
    configuration.output.name = name;
  }

  if (!type) {
    configuration.output.file = `./${BUILD_DIR}/umd/${file}.production.min.js`;
  }

  return configuration;
}

createConfigurations({
  type: 'Plugins',
  basePath: './src/plugins',
  files: [
    'AutoRender',
    'AutoRefresh',
    'DeveloperTools',
    'GenericPlugin',
    'Sticky',
    'Responsive',
  ]
});

createConfigurations({
  type: 'Networks',
  basePath: './src/networks',
  files: [
    'DFP',
    'Mock',
    'Noop',
  ]
});

createConfiguration({
  name: 'AdJS',
  path: './src/index.ts',
  file: 'core',
});

configurations.push(createProductionConfiguration({
  path: './src/debug.ts',
  prune: false,
  file: 'debug',
}));

module.exports = configurations;
