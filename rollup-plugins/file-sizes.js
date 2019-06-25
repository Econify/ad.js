const fileSize = require("filesize");
const gzip = require("gzip-size");
const brotli = require("brotli-size");
const terser = require("terser");

function filesize(cb, env) {
	const getData = function(bundle) {
    const { code, fileName } = bundle;
    const minifiedCode = terser.minify(code).code;

    const info = {
      fileName,
      bundleSize: fileSize(Buffer.byteLength(code)),
      brotliSize: fileSize(brotli.sync(code)),
      minSize: fileSize(minifiedCode.length),
      gzipSize: fileSize(gzip.sync(minifiedCode)),
    };
    
    console.log(info);

		return cb(fileName, info);
	};

	return {
		name: "filesize",
    generateBundle(outputOptions, bundle) {
			Object.keys(bundle).map(fileName => getData(bundle[fileName]))
		}
	};
}

module.exports = filesize;