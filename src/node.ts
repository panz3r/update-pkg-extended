/**
 * Node.js-specific package.json manipulation with filesystem operations
 * Extends the isomorphic core with file I/O capabilities
 */

import { resolve } from 'path'
import { PkgCore, PackageData, PkgCoreOptions } from './core.js'
import { readPackageSync, writePackage, writePackageSync } from './utils/package-io.js'

/**
 * Options for creating a new Pkg instance
 */
export interface PkgOptions extends PkgCoreOptions {
  create?: boolean
}

/**
 * Resolve package directory
 * @param dir - Directory path
 * @returns Resolved directory path
 */
function resolvePkg(dir?: string): string {
  return resolve(dir || './')
}

/**
 * Node.js package manipulation class with filesystem support
 * Extends the isomorphic core with file reading and writing capabilities
 */
export class Pkg extends PkgCore {
  options: PkgOptions
  path: string
  private _cwd: string

  constructor(cwd?: string, options?: PkgOptions) {
    // Handle different constructor overloads
    let resolvedCwd: string
    let resolvedOptions: PkgOptions
    
    if (typeof cwd === 'string') {
      // Traditional usage: new Pkg(cwd, options)
      resolvedCwd = cwd
      resolvedOptions = options || {}
    } else if (cwd && typeof cwd === 'object') {
      // New usage: new Pkg({ data: packageJson, create: true })
      resolvedCwd = './'
      resolvedOptions = cwd as PkgOptions
    } else {
      // Default usage: new Pkg()
      resolvedCwd = './'
      resolvedOptions = options || {}
    }

    let packageData: PackageData = {}

    // If data is provided in options, use it (isomorphic mode)
    if (resolvedOptions.data) {
      packageData = resolvedOptions.data
    } else {
      // Traditional mode: load from filesystem
      const finalCwd = resolvePkg(resolvedCwd)
      
      try {
        packageData = readPackageSync({ cwd: finalCwd })
      } catch (err: any) {
        if (err.code !== 'ENOENT' || (err.code === 'ENOENT' && !resolvedOptions.create)) {
          throw err
        }
        // If ENOENT and create is true, start with empty data
        packageData = {}
      }
    }

    // Initialize the isomorphic core with the package data
    super(packageData)

    // Store Node.js-specific properties
    this.options = Object.assign({ create: false }, resolvedOptions)
    this._cwd = resolvePkg(resolvedCwd)
    this.path = resolve(this._cwd, 'package.json')
  }

  /**
   * Save package.json to filesystem asynchronously
   * @returns Promise that resolves when file is written
   */
  save(): Promise<void> {
    return writePackage(this._cwd, this.data)
  }

  /**
   * Save package.json to filesystem synchronously
   * @returns This instance for chaining
   */
  saveSync(): this {
    writePackageSync(this._cwd, this.data)
    return this
  }
}

export default Pkg