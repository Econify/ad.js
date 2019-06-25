const fs = require('fs-extra');
const rollup = require('rollup');
const fileSize = require('filesize');
const gzip = require('gzip-size');
const brotli = require('brotli-size');
const { promisify } = require('util');
const configurations = require('./rollup.config.js');

const fsRead = promisify(fs.readFile).bind(fs);
const fsWrite = promisify(fs.writeFile).bind(fs);

const BUILD_DIR = './build';
const UMD_DIR = `${BUILD_DIR}/umd`;

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
  const files = await fs.readdir(UMD_DIR);
  let development = '';
  let production = '';

  for (let i = 0; i < files.length; i += 1) {
    const filePath = `${UMD_DIR}/${files[i]}`;
    const dev = filePath.endsWith('development.js');
    const prod = filePath.endsWith('production.min.js');

    if (dev || prod) {
      const data = await fsRead(filePath, 'utf8');
      dev ? development += data : production += data;
    }
  }

  await fsWrite(`${UMD_DIR}/bundle.development.js`, development);
  await fsWrite(`${UMD_DIR}/bundle.production.min.js`, production);
}

async function generateSizesFile() {
  const files = await fs.readdir(UMD_DIR);

  const data = await files.reduce(async (acc, cur) => {
    const resolvedAcc = await acc;
    
    if (!cur.endsWith('production.min.js')) {
      return resolvedAcc;
    }

    const filePath = `${UMD_DIR}/${cur}`;
    const data = await fsRead(filePath, 'utf8');
    const { size } = await fs.stat(filePath);
    const gzipRaw = gzip.sync(data);
    const brotliRaw = brotli.sync(data);

    resolvedAcc[cur] = {
      bundleSize: {
        formatted: String(size / 1024) + ' KB',
        raw: size,
      },
      brotliSize: {
        formatted: fileSize(brotliRaw),
        raw: brotliRaw,
      },
      gzipSize: {
        formatted: fileSize(gzipRaw),
        raw: gzipRaw,
      },
    };

    return resolvedAcc;
  }, Promise.resolve({}));
  
  await fs.writeJson(`${UMD_DIR}/sizes.json`, data)
};

const startTime = new Date().getTime();
build()
  .then(() => copyFiles())
  .then(() => createAllInclusiveBundles())
  .then(() => generateSizesFile())
  .then(() => {
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`** Build finished in ${elapsedTime}ms **`);
  });
