// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import { terser } from "rollup-plugin-terser";
const templateLiteralIndentFix = require('./rollup-plugins/template-literal-indent-fix');

const WEB_FORMAT = 'iife';
const NODE_FORMAT = 'cjs';

const SOURCEMAP = true;
const INDENT = false;

const BASE_PLUGINS = [
  typescript(),
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
  const outputFile = `./dist/${type}/${file}.js`;

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
    configuration.output.file = `./dist/${file}.js`;
  }

  return configuration;
}

function createDevelopmentConfiguration({ type, file, path, name }) {
  const outputFile = `./umd/${type}.${file}.development.js`.toLowerCase();

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
    configuration.output.file = `./umd/${file}.development.js`;
  }

  return configuration;
}

function createProductionConfiguration({ type, file, path, name }) {
  const configuration = {
    input: path,
    plugins: [
      ...BASE_PLUGINS,
      terser()
    ],
    output: {
      file: `./umd/${type}.${file}.production.min.js`.toLowerCase(),
      name: `_ADJS.${type}.${file}`,

      format: WEB_FORMAT,

      indent: INDENT,
      sourcemap: SOURCEMAP,
    },
  };

  if (name) {
    configuration.output.name = name;
  }

  if (!type) {
    configuration.output.file = `./umd/${file}.production.min.js`;
  }

  return configuration;
}

createConfigurations({
  type: 'Plugins',
  basePath: './src/plugins',
  files: [
    'AutoRender',
    'AutoRefresh',
    'Debug',
    'GenericPlugin',
    'Logging',
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

export default configurations;
