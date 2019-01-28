const rollup      = require('rollup')
const commonJs    = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const uglify      = require('rollup-plugin-uglify')
const filesize    = require('rollup-plugin-filesize')
const buble       = require('rollup-plugin-buble')
const fs          = require('fs-extra')
const path        = require('path')

const tmpFolder = '_build'
const target    = 'docs'

fs.removeSync(tmpFolder)
fs.ensureDirSync(tmpFolder)
fs.copySync('assets', tmpFolder)

rollup.rollup({
    input: 'src/app.js',
    plugins: [
      commonJs(),
      nodeResolve(),
      buble(),
      uglify.uglify({ mangle: true, compress: true }),
      filesize()
    ]
  })
  .then(bundle =>
    bundle.write({
      file      : path.join(tmpFolder, '/app.js'),
      format    : 'iife',
      sourcemap : true,
      name      : 'app.js'
    })
  )
  .then(() =>
    fs.moveSync(tmpFolder, target, { overwrite: true })
  )
  .catch(console.error)
