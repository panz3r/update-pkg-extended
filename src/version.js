'use strict'

const dotProp = require('dot-prop')

module.exports = class Version {
  constructor (sourceData) {
    this.data = sourceData

    this._v = []
    if (dotProp.has(this.data, 'version')) {
      this._v = dotProp.get(this.data, 'version').split('.')
    }

    this._v.length < 1 && (this._v[0] = 0)
    this._v.length < 2 && (this._v[1] = 0)
    this._v.length < 3 && (this._v[2] = 0)
  }

  get (segment) {
    switch (segment) {
      case 'major':
        return this._v[0]

      case 'minor':
        return this._v[1]

      case 'patch':
        return this._v[2]

      default:
        return this._v.join('.')
    }
  }

  _set () {
    dotProp.set(this.data, 'version', this.get())
    return this
  }

  newMajor () {
    return this.major().minor(0).patch(0)
  }

  newMinor () {
    return this.minor().patch(0)
  }

  major (major) {
    major !== undefined && major !== null ? this._v[0] = major : ++this._v[0]
    return this._set()
  }

  minor (minor) {
    minor !== undefined && minor !== null ? this._v[1] = minor : ++this._v[1]
    return this._set()
  }

  patch (patch) {
    patch !== undefined && patch !== null ? this._v[2] = patch : ++this._v[2]
    return this._set()
  }
}
