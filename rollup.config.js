// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import { terser } from "rollup-plugin-terser";
<<<<<<< HEAD
<<<<<<< HEAD
import copy from 'rollup-plugin-copy';
const templateLiteralIndentFix = require('./rollup-plugins/template-literal-indent-fix');
<<<<<<< HEAD
const minifyErrors = require('./rollup-plugins/error-minify');

const BUILD_DIR = 'build';
=======
const templateLiteralIndentFix = require('./rollup-plugins/template-literal-indent-fix');
>>>>>>> [SB] Switch to Rollup
=======
const errorMinifier = require('./rollup-plugins/error-minify');
>>>>>>> add build script
=======
import copy from 'rollup-plugin-copy';
const templateLiteralIndentFix = require('./rollup-plugins/template-literal-indent-fix');

const BUILD_DIR = 'build';
>>>>>>> [SB] Switch to Rollup

const WEB_FORMAT = 'iife';
const NODE_FORMAT = 'cjs';

const SOURCEMAP = true;
const INDENT = false;

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> [SB] Switch to Rollup
const FILES_TO_COPY = [
  './package.json',
  './README.md',
  './src/types.ts',
];

<<<<<<< HEAD
=======
>>>>>>> [SB] Switch to Rollup
=======
>>>>>>> [SB] Switch to Rollup
const BASE_PLUGINS = [
  typescript(),
  nodeResolve(),
  commonjs(),
  templateLiteralIndentFix(),
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> [SB] Switch to Rollup
  copy({
    targets: FILES_TO_COPY,
    outputFolder: BUILD_DIR,
  }),
<<<<<<< HEAD
=======
>>>>>>> [SB] Switch to Rollup
=======
>>>>>>> [SB] Switch to Rollup
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
<<<<<<< HEAD
<<<<<<< HEAD
  const outputFile = `./${BUILD_DIR}/${type}/${file}.js`;
=======
  const outputFile = `./dist/${type}/${file}.js`;
>>>>>>> [SB] Switch to Rollup
=======
  const outputFile = `./${BUILD_DIR}/${type}/${file}.js`;
>>>>>>> [SB] Switch to Rollup

  const configuration = {
    input: path,
    plugins: [
      ...BASE_PLUGINS,
<<<<<<< HEAD
      errorMinifier()
=======
>>>>>>> [SB] Switch to Rollup
    ],
    output: {
      file: outputFile,
      format: NODE_FORMAT,
    },
  };

  if (!type) {
<<<<<<< HEAD
<<<<<<< HEAD
    configuration.output.file = `./${BUILD_DIR}/${file}.js`;
=======
    configuration.output.file = `./dist/${file}.js`;
>>>>>>> [SB] Switch to Rollup
=======
    configuration.output.file = `./${BUILD_DIR}/${file}.js`;
>>>>>>> [SB] Switch to Rollup
  }

  return configuration;
}

function createDevelopmentConfiguration({ type, file, path, name }) {
<<<<<<< HEAD
<<<<<<< HEAD
  const outputFile = `./${BUILD_DIR}/umd/${type}.${file}.development.js`.toLowerCase();
=======
  const outputFile = `./umd/${type}.${file}.development.js`.toLowerCase();
>>>>>>> [SB] Switch to Rollup
=======
  const outputFile = `./${BUILD_DIR}/umd/${type}.${file}.development.js`.toLowerCase();
>>>>>>> [SB] Switch to Rollup

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
<<<<<<< HEAD
<<<<<<< HEAD
    configuration.output.file = `./${BUILD_DIR}/umd/${file}.development.js`;
=======
    configuration.output.file = `./umd/${file}.development.js`;
>>>>>>> [SB] Switch to Rollup
=======
    configuration.output.file = `./${BUILD_DIR}/umd/${file}.development.js`;
>>>>>>> [SB] Switch to Rollup
  }

  return configuration;
}

function createProductionConfiguration({ type, file, path, name }) {
  const configuration = {
    input: path,
    plugins: [
      ...BASE_PLUGINS,
<<<<<<< HEAD
<<<<<<< HEAD
      minifyErrors(),
=======
>>>>>>> [SB] Switch to Rollup
      terser()
    ],
    output: {
      file: `./${BUILD_DIR}/umd/${type}.${file}.production.min.js`.toLowerCase(),
<<<<<<< HEAD
=======
      terser()
    ],
    output: {
      file: `./umd/${type}.${file}.production.min.js`.toLowerCase(),
>>>>>>> [SB] Switch to Rollup
=======
>>>>>>> [SB] Switch to Rollup
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
<<<<<<< HEAD
<<<<<<< HEAD
    configuration.output.file = `./${BUILD_DIR}/umd/${file}.production.min.js`;
=======
    configuration.output.file = `./umd/${file}.production.min.js`;
>>>>>>> [SB] Switch to Rollup
=======
    configuration.output.file = `./${BUILD_DIR}/umd/${file}.production.min.js`;
>>>>>>> [SB] Switch to Rollup
  }

  return configuration;
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> [SB] Switch to Rollup
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

<<<<<<< HEAD
>>>>>>> [SB] Switch to Rollup
=======
>>>>>>> [SB] Switch to Rollup
createConfiguration({
  name: 'AdJS',
  path: './src/index.ts',
  file: 'core',
});

export default configurations;
