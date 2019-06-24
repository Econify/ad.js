const fs = require('fs-extra');
const rollup = require('rollup');
const { promisify } = require('util');
const { configurations, fileSizesObject } = require('./rollup.config.js');

const read = promisify(fs.readFile).bind(fs);
const write = promisify(fs.writeFile).bind(fs);

const BUILD_DIR = './build';

const FILES_TO_COPY = [
  { path: './package.json', name: 'package.json' },
  { path: './README.md', name: 'README.md' },
  { path: './src/types.ts', name: 'types.ts' },
];

async function build() {
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

async function createAllInclusiveBundles() {
  const files = await fs.readdir('./build/umd/');
  let development = '';
  let production = '';

  for (let i = 0; i < files.length; i += 1) {
    const filePath = `./build/umd/${files[i]}`;
    const dev = filePath.endsWith('development.js');
    const prod = filePath.endsWith('production.min.js');

    if (dev || prod) {
      const data = await read(filePath, 'utf8');
      dev ? development += data : production += data;
    }
  }

  await write('./build/umd/bundle.development.js', development);
  await write('./build/umd/bundle.production.min.js', production);
}

const startTime = new Date().getTime();
build()
  .then(() => fs.writeJson(`${BUILD_DIR}/umd/sizes.json`, fileSizesObject))
  .then(() => copyFiles())
  .then(() => createAllInclusiveBundles())
  .then(() => {
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`** Build finished in ${elapsedTime}ms **`);
  });
