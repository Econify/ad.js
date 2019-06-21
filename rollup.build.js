const fs = require('fs-extra');
const rollup = require('rollup');
const { configurations, fileSizesObject } = require('./rollup.config.js');

const BUILD_DIR = './build';

const FILES_TO_COPY = [
  { path: './package.json', name: 'package.json' },
  { path: './README.md', name: 'README.md' },
  { path: './src/types.ts', name: 'types.ts' },
];

async function createBundle() {
  return Promise.all(configurations.map(async (config) => {
    const { input, plugins, output } = config;

    const inputOptions = { input, plugins };
    const outputOptions = output;

    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
  }));
};

async function copyFiles() {
  return Promise.all(FILES_TO_COPY.map(async (file) => {
    await fs.copy(file.path, `${BUILD_DIR}/${file.name}`)
  }))
}

const startTime = new Date().getTime();
createBundle()
  .then(() => fs.writeJson(`${BUILD_DIR}/umd/sizes.json`, fileSizesObject))
  .then(() => copyFiles())
  .then(() => {
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`** Build finished in ${elapsedTime}ms **`);
  });
