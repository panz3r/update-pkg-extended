'use strict'

const dotProp = require('dot-prop')
const path = require('path')
const readPkg = require('read-pkg')
const writePkg = require('write-pkg')

const Version = require('./version')

function resolvePkg (dir) {
  dir = dir || './'
  return path.resolve(dir)
}

module.exports = class Pkg {
  constructor (cwd, options) {
    this.options = Object.assign({ create: false }, options)

    // Store CWD
    this._cwd = resolvePkg(cwd)

    // Load data from package.json
    this._data = {}
    try {
      this._data = readPkg.sync({ cwd: this._cwd })
    } catch (err) {
      if (err.code !== 'ENOENT' || (err.code === 'ENOENT' && !this.options.create)) {
        throw err
      }
    }

    // Setup path
    this.path = path.resolve(this._cwd, 'package.json')

    // Setup version
    this.version = new Version(this._data)
  }

  set (prop, value) {
    dotProp.set(this._data, prop, value)
    return this
  }

  get (prop, defaultValue) {
    return dotProp.get(this._data, prop, defaultValue)
  }

  update (prop, fn) {
    return this.set(prop, fn(this.get(prop)))
  }

  append (prop, value) {
    return this.update(prop, oldValue => (oldValue || []).concat(value))
  }

  prepend (prop, value) {
    return this.update(prop, oldValue => [value].concat((oldValue || [])))
  }

  del (prop) {
    dotProp.delete(this._data, prop)
    return this
  }

  has (prop) {
    return dotProp.has(this._data, prop)
  }

  save () {
    return writePkg(this._cwd, this._data)
  }

  saveSync () {
    writePkg.sync(this._cwd, this._data)
    return this
  }
}
