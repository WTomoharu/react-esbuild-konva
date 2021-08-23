const esbuild = require('esbuild')

const fs = require('fs-extra');
const glob = require('glob')

function getPaths(patterns) {
  return [].concat(...patterns.map(pattern => glob.sync(pattern)))
}

// remove old dist dir
fs.removeSync("./dist")

// build src
esbuild.build({
  entryPoints: getPaths([
    "src/pages/**/index.@(js|ts|jsx|tsx)",
  ]),

  outbase: './src/pages',
  outdir: './dist',

  bundle: true,
  minify: false,
  sourcemap: "inline",

  watch: process.argv.includes("--watch") ? {
    onRebuild: (error, result) => {
      if (!error && result) {
        console.log(`${new Date().toLocaleString()} watch build succeeded\n`);
      }
    }
  } : false,
}).then(() => {
  console.log(`${new Date().toLocaleString()} build succeeded`);
  if (process.argv.includes("--watch")) console.log("")
}).catch(() => {
})


// copy static files
for (const path of getPaths(["@(src|public)/**/*.!(js|ts|jsx|tsx)"])) {
  fs.copySync(`./${path}`, path.replace(/(^src\/pages|^src|^public)\//gm, "./dist/"))
}
