import { test } from 'node:test'
import assert from 'node:assert'

// Test the main entry point
test('main entry exports Node.js Pkg by default for backward compatibility', async () => {
  const module = await import('../dist/index.js')

  assert.ok(module.default)
  assert.strictEqual(typeof module.default, 'function')

  // Should also export PkgCore, Version, and types
  assert.ok(module.PkgCore)
  assert.ok(module.Version)

  // Test that default export is the Node.js version (has save/saveSync)
  const DefaultPkg = module.default
  const pkg = new DefaultPkg('./', { create: true })
  assert.strictEqual(typeof pkg.save, 'function')
  assert.strictEqual(typeof pkg.saveSync, 'function')
  assert.ok(pkg.path)
})

// Test the core entry point
test('core entry exports isomorphic Pkg', async () => {
  const module = await import('../dist/core-entry.js')

  assert.ok(module.Pkg)
  assert.ok(module.PkgCore)
  assert.ok(module.Version)

  // Should be the same class
  assert.strictEqual(module.Pkg, module.PkgCore)

  // Test that it's isomorphic (no filesystem methods)
  const pkg = new module.Pkg({ name: 'test' })
  assert.strictEqual(typeof pkg.save, 'undefined')
  assert.strictEqual(typeof pkg.saveSync, 'undefined')
  assert.strictEqual(typeof pkg.path, 'undefined')
  assert.strictEqual(typeof pkg.stringify, 'function')
})

// Test the node entry point
test('node entry exports Node.js Pkg', async () => {
  const module = await import('../dist/node-entry.js')

  assert.ok(module.default)
  assert.ok(module.Pkg)
  assert.ok(module.PkgCore)
  assert.ok(module.Version)

  // Should be the same class
  assert.strictEqual(module.default, module.Pkg)

  // Test that it has filesystem methods
  const NodePkg = module.default
  const pkg = new NodePkg('./', { create: true })
  assert.strictEqual(typeof pkg.save, 'function')
  assert.strictEqual(typeof pkg.saveSync, 'function')
  assert.ok(pkg.path)
})

// Test compatibility between exports
test('all entry points export compatible Version class', async () => {
  const mainModule = await import('../dist/index.js')
  const coreModule = await import('../dist/core-entry.js')
  const nodeModule = await import('../dist/node-entry.js')

  // All should export the same Version class
  assert.strictEqual(mainModule.Version, coreModule.Version)
  assert.strictEqual(mainModule.Version, nodeModule.Version)
})

test('Pkg is consistently exported from all entry points', async () => {
  const mainModule = await import('../dist/index.js')
  const coreModule = await import('../dist/core-entry.js')
  const nodeModule = await import('../dist/node-entry.js')

  // Core and node entry points should both export Pkg
  assert.ok(coreModule.Pkg)
  assert.ok(nodeModule.Pkg)

  // Main should export PkgCore (core class) and default should be node Pkg
  assert.ok(mainModule.PkgCore)
  assert.strictEqual(mainModule.default, nodeModule.Pkg)

  // Core entry Pkg should be the same as main PkgCore
  assert.strictEqual(coreModule.Pkg, mainModule.PkgCore)
  assert.strictEqual(coreModule.Pkg, coreModule.PkgCore)
})
