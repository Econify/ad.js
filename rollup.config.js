// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import { terser } from "rollup-plugin-terser";

import path from 'path';

const FORMAT = 'umd';
const SOURCEMAP = true;
const INDENT = false;

const BASE_PLUGINS = [
  nodeResolve(),
  typescript(),
  commonjs(),
];

const configurations = [];

function createConfiguration({ type, files, basePath }) {
  files.forEach((file) => {
    const path = `${basePath}/${file}.ts`;

    const configuration  = {
      plugins: [
        ...BASE_PLUGINS,
      ],
      input: path,
      output: {
        file: `./umd/${type}.${file}.js`.toLowerCase(),
        name: `_ADJS.${type}.${file}`,

        format: FORMAT,

        indent: INDENT,
        sourcemap: SOURCEMAP,
      },
    };

    const minifiedConfiguration = createMinifiedConfiguration(configuration);

    configurations.push(configuration);
    configurations.push(minifiedConfiguration);
  });
}

function createMinifiedConfiguration(configuration) {
  const minifiedConfiguration = {
    ...configuration,
    plugins: [
      ...configuration.plugins,
      terser()
    ],

    output: {
      ...configuration.output,

      file: configuration.output.file.replace(/\.js/, '.min.js'),
    }
  };

  return minifiedConfiguration;
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
    'Responsive',
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
const coreConfiguration = {
  plugins: [
    ...BASE_PLUGINS,
  ],

  input: './src/index.ts',
  output: {
    file: './umd/core.js',
    name: 'AdJS',

    format: FORMAT,
    indent: INDENT,
    sourcemap: SOURCEMAP,
  },
};

const minifiedCoreConfiguration = createMinifiedConfiguration(coreConfiguration);

configurations.push(coreConfiguration, minifiedCoreConfiguration);

export default configurations;
