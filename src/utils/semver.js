/**
 * Internal implementation of semantic version parsing and manipulation
 * Simplified semver implementation focused on the features used by this library
 */

/**
 * Simple semantic version class
 */
export class SemVer {
  constructor(version) {
    this.raw = version || '0.0.0'
    this.loose = false
    this.includePrerelease = false
    this.options = {}
    this.prerelease = []
    this.build = []
    
    this.parse(version)
  }
  
  /**
   * Parse a version string
   * @param {string} version - Version string to parse
   */
  parse(version) {
    if (!version) {
      this.major = 0
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      this.build = []
      this.version = '0.0.0'
      return
    }
    
    // Remove leading 'v' if present
    const cleanVersion = version.replace(/^v/, '')
    
    // Split by '+' for build metadata
    const [versionPart, buildPart] = cleanVersion.split('+')
    this.build = buildPart ? buildPart.split('.') : []
    
    // Split by '-' for prerelease
    const [corePart, prereleasePart] = versionPart.split('-')
    this.prerelease = prereleasePart ? prereleasePart.split('.') : []
    
    // Parse core version (major.minor.patch)
    const coreParts = corePart.split('.')
    this.major = parseInt(coreParts[0] || '0', 10)
    this.minor = parseInt(coreParts[1] || '0', 10)
    this.patch = parseInt(coreParts[2] || '0', 10)
    
    // Rebuild version string
    this.version = this.format()
  }
  
  /**
   * Format version as string
   * @returns {string} Formatted version string
   */
  format() {
    let version = `${this.major}.${this.minor}.${this.patch}`
    
    if (this.prerelease && this.prerelease.length > 0) {
      version += '-' + this.prerelease.join('.')
    }
    
    if (this.build && this.build.length > 0) {
      version += '+' + this.build.join('.')
    }
    
    return version
  }
  
  /**
   * Increment version based on release type
   * @param {string} release - Release type: major, minor, patch, prerelease
   * @param {string} identifier - Prerelease identifier (for prerelease bumps)
   */
  inc(release, identifier) {
    switch (release) {
      case 'major':
        if (this.prerelease.length > 0) {
          // If there's a prerelease, just remove it (don't increment major)
          this.prerelease = []
        } else {
          // Normal major increment
          this.major++
          this.minor = 0
          this.patch = 0
        }
        break
        
      case 'minor':
        if (this.prerelease.length > 0) {
          // If there's a prerelease, just remove it (don't increment minor)
          this.prerelease = []
        } else {
          // Normal minor increment
          this.minor++
          this.patch = 0
        }
        break
        
      case 'patch':
        if (this.prerelease.length > 0) {
          // If there's a prerelease, just remove it (don't increment patch)
          this.prerelease = []
        } else {
          // Normal patch increment
          this.patch++
        }
        break
        
      case 'prerelease':
        if (this.prerelease.length === 0) {
          // First prerelease, increment patch and add prerelease
          this.patch++
          this.prerelease = [identifier || 'alpha', 0]
        } else {
          // Increment existing prerelease
          const lastIndex = this.prerelease.length - 1
          const lastItem = this.prerelease[lastIndex]
          
          if (typeof lastItem === 'number' || /^\d+$/.test(lastItem)) {
            this.prerelease[lastIndex] = parseInt(lastItem, 10) + 1
          } else {
            this.prerelease.push(0)
          }
        }
        break
        
      default:
        throw new Error(`Invalid release type: ${release}`)
    }
    
    this.version = this.format()
    return this
  }
  
  /**
   * Return string representation
   * @returns {string} Version string
   */
  toString() {
    return this.version
  }
}

/**
 * Parse a version string and return a SemVer object
 * @param {string} version - Version string to parse
 * @returns {SemVer|null} Parsed SemVer object or null if invalid
 */
export default function parse(version) {
  if (!version || typeof version !== 'string') {
    return null
  }
  
  try {
    return new SemVer(version)
  } catch (error) {
    return null
  }
}