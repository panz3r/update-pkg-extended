import dotProp from 'dot-prop'
import { resolve } from 'path'
import { readPackageSync } from 'read-pkg'
import { writePackage, writePackageSync } from 'write-pkg'

import Version from './version.js'

function resolvePkg (dir) {
  return resolve(dir || './')
}

class Pkg {
  constructor (cwd, options) {
    this.options = Object.assign({ create: false }, options)

    // Store CWD
    this._cwd = resolvePkg(cwd)

    // Load data from package.json
    this._data = {}
    try {
      this._data = readPackageSync({ cwd: this._cwd })
    } catch (err) {
      if (err.code !== 'ENOENT' || (err.code === 'ENOENT' && !this.options.create)) {
        throw err
      }
    }

    // Setup path
    this.path = resolve(this._cwd, 'package.json')

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
    return writePackage(this._cwd, this._data)
  }

  saveSync () {
    writePackageSync(this._cwd, this._data)
    return this
  }
}

export default Pkg
