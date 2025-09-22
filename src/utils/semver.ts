/**
 * Internal implementation of semantic version parsing and manipulation
 * Simplified semver implementation focused on the features used by this library
 */

/**
 * Valid release types for version increment
 */
type ReleaseType = 'major' | 'minor' | 'patch' | 'prerelease'

/**
 * Simple semantic version class
 */
export class SemVer {
  raw: string
  major: number
  minor: number
  patch: number
  prerelease: (string | number)[]

  constructor(version?: string) {
    this.raw = version || '0.0.0'
    this.major = 0
    this.minor = 0
    this.patch = 0
    this.prerelease = []
    this.parse(version)
  }
  
  /**
   * Parse a version string
   * @param version - Version string to parse
   */
  parse(version?: string): void {
    const cleanVersion = (version || '0.0.0').replace(/^v/, '')
    
    // Split by '+' for build metadata
    const [versionPart] = cleanVersion.split('+')
    
    // Split by '-' for prerelease
    const [corePart, prereleasePart] = versionPart.split('-')
    this.prerelease = prereleasePart ? prereleasePart.split('.') : []
    
    // Parse core version (major.minor.patch)
    const coreParts = corePart.split('.')
    this.major = parseInt(coreParts[0] || '0', 10)
    this.minor = parseInt(coreParts[1] || '0', 10)
    this.patch = parseInt(coreParts[2] || '0', 10)
  }
  
  /**
   * Format version as string
   * @returns Formatted version string
   */
  format(): string {
    let version = `${this.major}.${this.minor}.${this.patch}`
    
    if (this.prerelease && this.prerelease.length > 0) {
      version += '-' + this.prerelease.join('.')
    }
    
    return version
  }
  
  /**
   * Increment version based on release type
   * @param release - Release type: major, minor, patch, prerelease
   * @param identifier - Prerelease identifier (for prerelease bumps)
   */
  inc(release: ReleaseType, identifier?: string): this {
    switch (release) {
      case 'major':
        if (this.prerelease.length > 0) {
          this.prerelease = []
        } else {
          this.major++
          this.minor = 0
          this.patch = 0
        }
        break
        
      case 'minor':
        if (this.prerelease.length > 0) {
          this.prerelease = []
        } else {
          this.minor++
          this.patch = 0
        }
        break
        
      case 'patch':
        if (this.prerelease.length > 0) {
          this.prerelease = []
        } else {
          this.patch++
        }
        break
        
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.patch++
          this.prerelease = [identifier || 'alpha', 0]
        } else {
          const lastIndex = this.prerelease.length - 1
          const lastItem = this.prerelease[lastIndex]
          
          if (typeof lastItem === 'number' || /^\d+$/.test(String(lastItem))) {
            this.prerelease[lastIndex] = parseInt(String(lastItem), 10) + 1
          } else {
            this.prerelease.push(0)
          }
        }
        break
    }
    
    return this
  }
}

/**
 * Parse a version string and return a SemVer object
 * @param version - Version string to parse
 * @returns Parsed SemVer object
 */
export default function parse(version?: string): SemVer {
  return new SemVer(version)
}