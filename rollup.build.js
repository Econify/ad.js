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
  const promises = await configurations.map(async (config) => {
    const { input, plugins, output } = config;

    const inputOptions = { input, plugins };
    const outputOptions = output;

    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
  });

  return Promise.all(promises);
};

async function copyFiles() {
  for (let i = 0; i < FILES_TO_COPY.length; i += 1) {
    const file = FILES_TO_COPY[i];
    await fs.copy(file.path, `${BUILD_DIR}/${file.name}`);
  }
}

const startTime = new Date().getTime();
createBundle()
  .then(() => fs.writeJson(`${BUILD_DIR}/umd/sizes.json`, fileSizesObject))
  .then(() => copyFiles())
  .then(() => {
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`** Build finished in ${elapsedTime}ms **`);
  });

