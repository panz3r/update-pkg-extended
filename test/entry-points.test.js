import test from 'ava'

// Test the main entry point
test('main entry exports Node.js Pkg by default for backward compatibility', async t => {
  const module = await import('../dist/index.js')

  t.truthy(module.default)
  t.is(typeof module.default, 'function')

  // Should also export PkgCore, Version, and types
  t.truthy(module.PkgCore)
  t.truthy(module.Version)

  // Test that default export is the Node.js version (has save/saveSync)
  const DefaultPkg = module.default
  const pkg = new DefaultPkg('./', { create: true })
  t.is(typeof pkg.save, 'function')
  t.is(typeof pkg.saveSync, 'function')
  t.truthy(pkg.path)
})

// Test the core entry point
test('core entry exports isomorphic PkgCore', async t => {
  const module = await import('../dist/core-entry.js')

  t.truthy(module.default)
  t.truthy(module.PkgCore)
  t.truthy(module.Version)

  // Should be the same class
  t.is(module.default, module.PkgCore)

  // Test that it's isomorphic (no filesystem methods)
  const CorePkg = module.default
  const pkg = new CorePkg({ name: 'test' })
  t.is(typeof pkg.save, 'undefined')
  t.is(typeof pkg.saveSync, 'undefined')
  t.is(typeof pkg.path, 'undefined')
  t.is(typeof pkg.stringify, 'function')
})

// Test the node entry point
test('node entry exports Node.js Pkg', async t => {
  const module = await import('../dist/node-entry.js')

  t.truthy(module.default)
  t.truthy(module.Pkg)
  t.truthy(module.PkgCore)
  t.truthy(module.Version)

  // Should be the same class
  t.is(module.default, module.Pkg)

  // Test that it has filesystem methods
  const NodePkg = module.default
  const pkg = new NodePkg('./', { create: true })
  t.is(typeof pkg.save, 'function')
  t.is(typeof pkg.saveSync, 'function')
  t.truthy(pkg.path)
})

// Test compatibility between exports
test('all entry points export compatible Version class', async t => {
  const mainModule = await import('../dist/index.js')
  const coreModule = await import('../dist/core-entry.js')
  const nodeModule = await import('../dist/node-entry.js')

  // All should export the same Version class
  t.is(mainModule.Version, coreModule.Version)
  t.is(mainModule.Version, nodeModule.Version)
})

test('PkgCore is consistently exported', async t => {
  const mainModule = await import('../dist/index.js')
  const coreModule = await import('../dist/core-entry.js')
  const nodeModule = await import('../dist/node-entry.js')

  // All should export the same PkgCore class
  t.is(mainModule.PkgCore, coreModule.PkgCore)
  t.is(mainModule.PkgCore, nodeModule.PkgCore)
  t.is(coreModule.default, coreModule.PkgCore)
})
