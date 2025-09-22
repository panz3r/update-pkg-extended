import { getProperty, setProperty } from './utils/dot-prop.js'
import svParse from './utils/semver.js'

class Version {
  constructor (sourceData) {
    this.data = sourceData
    this._v = svParse(getProperty(this.data, 'version', '0.0.0'))
  }

  get (segment) {
    switch (segment) {
      case 'major':
        return this._v.major.toString()

      case 'minor':
        return this._v.minor.toString()

      case 'patch':
        return this._v.patch.toString()

      case 'prerelease':
      case 'prelease':  // Backward compatibility for typo
        return this._v.prerelease && this._v.prerelease.length > 0 ? this._v.prerelease.join('.') : null

      default:
        return this._v.format()
    }
  }

  _set () {
    setProperty(this.data, 'version', this.get())
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

  prerelease (prereleaseIdentifier, prereleaseVersion) {
    if (!prereleaseIdentifier) {
      throw new Error('Missing required argument prereleaseIdentifier')
    }

    if (prereleaseVersion !== undefined && prereleaseVersion !== null) {
      this._v.prerelease = [prereleaseIdentifier, prereleaseVersion]
    } else {
      this._v.inc('prerelease', prereleaseIdentifier)
    }

    return this._set()
  }
}

export default Version
