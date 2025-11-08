const esbuild = require('esbuild');
const { copy } = require('esbuild-plugin-copy');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

const start = performance.now();

const config = {
  entryPoints: ['./server.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outfile: 'dist/server.js',
  minify: true,
  plugins: [
    copy({
        assets: {
            from: ['./config.json'],
            to: ['config.json'], // dist/config.json
            keepStructure: false
        },
        verbose: true
    })
  ],
};

esbuild
    .build(config)
    .then(() => {
        const outputFile = path.join(__dirname, 'dist/server.js');
        const stats = fs.statSync(outputFile);
        const sizeKB = (stats.size / 1024).toFixed(2);
        const duration = (performance.now() - start).toFixed(0);

        console.log(`📦 Build complete`);
        console.log(`📏 Output size: ${sizeKB} KB`);
        console.log(`⏱️ Build time: ${duration} ms`);
        })
    .catch(err => {
        console.error('❌ Build failed:', err);
        process.exit(1);
    });