import { getProperty, setProperty } from './utils/dot-prop.js'
import svParse, { SemVer } from './utils/semver.js'

/**
 * Package data interface
 */
interface PackageData {
  [key: string]: any
}

/**
 * Version segment type
 */
type VersionSegment = 'major' | 'minor' | 'patch' | 'prerelease' | 'prelease'

/**
 * Version manipulation class
 */
class Version {
  data: PackageData
  private _v: SemVer

  constructor(sourceData?: PackageData) {
    this.data = sourceData || {}
    this._v = svParse(getProperty(this.data, 'version', '0.0.0') as string)
  }

  get(segment?: VersionSegment): string | null {
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

  private _set(): this {
    setProperty(this.data, 'version', this.get())
    return this
  }

  newMajor(): this {
    this._v.inc('major')
    return this._set()
  }

  newMinor(): this {
    this._v.inc('minor')
    return this._set()
  }

  newPatch(): this {
    this._v.inc('patch')
    return this._set()
  }

  major(major?: number): this {
    if (major !== undefined && major !== null) {
      this._v.major = major
    } else {
      this._v.major++
    }
    return this._set()
  }

  minor(minor?: number): this {
    if (minor !== undefined && minor !== null) {
      this._v.minor = minor
    } else {
      this._v.minor++
    }
    return this._set()
  }

  patch(patch?: number): this {
    if (patch !== undefined && patch !== null) {
      this._v.patch = patch
    } else {
      this._v.patch++
    }
    return this._set()
  }

  prerelease(prereleaseIdentifier: string, prereleaseVersion?: number): this {
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