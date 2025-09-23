/**
 * Isomorphic core package.json manipulation functionality
 * Works with provided package.json data without Node.js filesystem dependencies
 */

import { deleteProperty, getProperty, hasProperty, setProperty } from './utils/dot-prop.js'
import Version from './version.js'

/**
 * Package data interface
 */
export interface PackageData {
  [key: string]: any
}

/**
 * Options for creating a new PkgCore instance
 */
export interface PkgCoreOptions {
  data?: PackageData
}

/**
 * Isomorphic package manipulation class
 * Works with provided package.json data without filesystem dependencies
 */
export class PkgCore {
  version: Version
  private _data: PackageData

  constructor(data?: PackageData | PkgCoreOptions, options?: PkgCoreOptions) {
    // Handle overloaded constructor signatures
    let packageData: PackageData
    
    if (data && typeof data === 'object' && 'data' in data) {
      // Called with options object: new PkgCore({ data: packageJson })
      packageData = data.data || {}
    } else if (data && typeof data === 'object') {
      // Called with package data directly: new PkgCore(packageJson)
      packageData = data
    } else {
      // Called with no arguments or invalid arguments
      packageData = {}
    }

    // Store the package data
    this._data = packageData

    // Setup version
    this.version = new Version(this._data)
  }

  /**
   * Get the current package data
   */
  get data(): PackageData {
    return this._data
  }

  /**
   * Set a property value using dot notation
   * @param prop - Property path (e.g., 'author.name')
   * @param value - Value to set
   * @returns This instance for chaining
   */
  set(prop: string, value: unknown): this {
    setProperty(this._data, prop, value)
    return this
  }

  /**
   * Get a property value using dot notation
   * @param prop - Property path (e.g., 'author.name')
   * @param defaultValue - Default value if property doesn't exist
   * @returns Property value
   */
  get(prop: string, defaultValue?: unknown): unknown {
    return getProperty(this._data, prop, defaultValue)
  }

  /**
   * Update a property using a function
   * @param prop - Property path
   * @param fn - Function to transform current value
   * @returns This instance for chaining
   */
  update(prop: string, fn: (currentValue: unknown) => unknown): this {
    return this.set(prop, fn(this.get(prop)))
  }

  /**
   * Append value to an array property
   * @param prop - Property path
   * @param value - Value to append
   * @returns This instance for chaining
   */
  append(prop: string, value: unknown): this {
    return this.update(prop, oldValue => (oldValue as any[] || []).concat(value))
  }

  /**
   * Prepend value to an array property
   * @param prop - Property path
   * @param value - Value to prepend
   * @returns This instance for chaining
   */
  prepend(prop: string, value: unknown): this {
    return this.update(prop, oldValue => [value].concat((oldValue as any[] || [])))
  }

  /**
   * Delete a property
   * @param prop - Property path to delete
   * @returns This instance for chaining
   */
  del(prop: string): this {
    deleteProperty(this._data, prop)
    return this
  }

  /**
   * Check if a property exists
   * @param prop - Property path to check
   * @returns True if property exists
   */
  has(prop: string): boolean {
    return hasProperty(this._data, prop)
  }

  /**
   * Get the package.json content as a formatted string
   * @param space - Number of spaces for indentation (default: 2)
   * @returns Formatted JSON string
   */
  stringify(space: number = 2): string {
    return JSON.stringify(this._data, null, space) + '\n'
  }
}

export default PkgCore