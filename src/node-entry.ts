/**
 * Node.js-specific entry point for update-pkg-extended
 * Import from 'update-pkg-extended/node' to get explicit Node.js functionality
 */

export { default, Pkg } from './node.js'
export { default as Version } from './version.js'
export { PkgCore } from './core.js'
export type { PackageData, PkgCoreOptions } from './core.js'
export type { PkgOptions } from './node.js'