import { resolve } from 'path'
import { deleteProperty, getProperty, hasProperty, setProperty } from './utils/dot-prop.js'
import { readPackageSync, writePackage, writePackageSync } from './utils/package-io.js'
import Version from './version.js'

/**
 * Options for creating a new Pkg instance
 */
interface PkgOptions {
  create?: boolean
}

/**
 * Package data interface
 */
interface PackageData {
  [key: string]: any
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
 * Package manipulation class
 */
class Pkg {
  options: PkgOptions
  path: string
  version: Version
  private _cwd: string
  private _data: PackageData

  constructor(cwd?: string, options?: PkgOptions) {
    this.options = Object.assign({ create: false }, options)

    // Store CWD
    this._cwd = resolvePkg(cwd)

    // Load data from package.json
    this._data = {}
    try {
      this._data = readPackageSync({ cwd: this._cwd })
    } catch (err: any) {
      if (err.code !== 'ENOENT' || (err.code === 'ENOENT' && !this.options.create)) {
        throw err
      }
    }

    // Setup path
    this.path = resolve(this._cwd, 'package.json')

    // Setup version
    this.version = new Version(this._data)
  }

  set(prop: string, value: unknown): this {
    setProperty(this._data, prop, value)
    return this
  }

  get(prop: string, defaultValue?: unknown): unknown {
    return getProperty(this._data, prop, defaultValue)
  }

  update(prop: string, fn: (currentValue: unknown) => unknown): this {
    return this.set(prop, fn(this.get(prop)))
  }

  append(prop: string, value: unknown): this {
    return this.update(prop, oldValue => (oldValue as any[] || []).concat(value))
  }

  prepend(prop: string, value: unknown): this {
    return this.update(prop, oldValue => [value].concat((oldValue as any[] || [])))
  }

  del(prop: string): this {
    deleteProperty(this._data, prop)
    return this
  }

  has(prop: string): boolean {
    return hasProperty(this._data, prop)
  }

  save(): Promise<void> {
    return writePackage(this._cwd, this._data)
  }

  saveSync(): this {
    writePackageSync(this._cwd, this._data)
    return this
  }
}

export default Pkg