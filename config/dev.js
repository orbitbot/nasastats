const wright      = require('wright')
const rollup      = require('rollup')
const rootImport  = require('rollup-plugin-root-import')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs    = require('rollup-plugin-commonjs')
const copy        = require('rollup-plugin-copy')
const buble       = require('rollup-plugin-buble')
const filesize    = require('rollup-plugin-filesize')

let cache = null

wright({
  main  : 'assets/index.html',
  debug : true,
  run   : 'm.redraw',
  js    : {
    path    : 'app.js',
    compile : compile,
    watch   : 'src/**/*.js'
  }
})

function compile() {
  return rollup.rollup({
    input : 'src/app.js',
    cache : cache,
    plugins: [
      nodeResolve({ jsnext: true, main: true, browser: true, preferBuiltins: false }),
      commonjs(),
      rootImport({ root: `${__dirname}/src`, extensions: ['.js', '/index.js'] }), // rootImport expects cwd to be repo root
      filesize()
    ]
  })
  .then(bundle => (
    cache = bundle,
    bundle.generate({
      format    : 'iife',
      name      : 'app.js',
      sourcemap : true
    })
  ))
  .then(generated => generated.output[0].code)
}
