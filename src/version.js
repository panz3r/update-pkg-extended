'use strict'

const dotProp = require('dot-prop')
const semver = require('semver')

module.exports = class Version {
  constructor (sourceData) {
    this.data = sourceData
    this._v = semver.parse(dotProp.get(this.data, 'version', '0.0.0'))
  }

  get (segment) {
    switch (segment) {
      case 'major':
        return this._v.major.toString()

      case 'minor':
        return this._v.minor.toString()

      case 'patch':
        return this._v.patch.toString()

      case 'prelease':
        return this._v.prerelease

      default:
        return this._v.format()
    }
  }

  _set () {
    dotProp.set(this.data, 'version', this.get())
    return this
  }

  newMajor () {
    this._v.inc('major')
    return this._set()
  }

  newMinor () {
    this._v.inc('minor')
    return this._set()
  }

  newPatch () {
    this._v.inc('patch')
    return this._set()
  }

  major (major) {
    major !== undefined && major !== null ? this._v.major = major : this._v.major++
    return this._set()
  }

  minor (minor) {
    minor !== undefined && minor !== null ? this._v.minor = minor : this._v.minor++
    return this._set()
  }

  patch (patch) {
    patch !== undefined && patch !== null ? this._v.patch = patch : this._v.patch++
    return this._set()
  }
}
