const fileSize = require("filesize");
const gzip = require("gzip-size");
const brotli = require("brotli-size");
const terser = require("terser");

function getSizes(cb, bundle) {
  const { code, fileName } = bundle;
  const minifiedCode = terser.minify(code).code;

  const options = {
    unix: true,
  };

  const info = {
    fileName,
    bundleSize: {
      formatted: fileSize(Buffer.byteLength(code), options),
      bytes: Buffer.byteLength(code),
    },
    brotliSize: {
      formatted: fileSize(brotli.sync(code), options),
      bytes: brotli.sync(code),
    },
    minSize: {
      formatted: fileSize(minifiedCode.length, options),
      bytes: minifiedCode.length,
    },
    gzipSize: {
      formatted: fileSize(gzip.sync(minifiedCode), options),
      bytes: gzip.sync(minifiedCode),
    },
  };

  return cb(fileName, info);
};

function filesize(cb, env) {
  return {
    name: "filesize",
    generateBundle(outputOptions, bundle) {
      Object.keys(bundle).map(fileName => getSizes(cb, bundle[fileName]))
    }
  };
}

module.exports = filesize;