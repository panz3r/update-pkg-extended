import test from 'ava'
import { join } from 'path'
import { rimrafSync } from 'rimraf'
import tmp from 'tmp'

import { Pkg } from '../dist/node.js'

// Create tmp dir for each test
test.beforeEach(t => {
  t.context.tmpDir = tmp.dirSync().name
})

// Cleanup tmp dir
test.afterEach.always(t => {
  rimrafSync(t.context.tmpDir)
})

// CONSTRUCTOR TESTS

test('Node Pkg constructor with data option (isomorphic mode)', t => {
  const packageData = {
    name: 'isomorphic-test',
    version: '1.0.0',
    description: 'Testing isomorphic mode'
  }

  const pkg = new Pkg('./', { data: packageData })

  t.deepEqual(pkg.data, packageData)
  t.is(pkg.get('name'), 'isomorphic-test')
  t.is(pkg.version.get(), '1.0.0')
  t.truthy(pkg.path) // Should still have a path even in isomorphic mode
})

test('Node Pkg constructor with options-only (isomorphic mode)', t => {
  const packageData = { name: 'test-pkg', version: '2.0.0' }

  const pkg = new Pkg({ data: packageData, create: true })

  t.deepEqual(pkg.data, packageData)
  t.is(pkg.get('name'), 'test-pkg')
  t.is(pkg.version.get(), '2.0.0')
})

test('Node Pkg constructor traditional mode works', async t => {
  const { tmpDir } = t.context

  // Create a package.json file
  const fs = await import('fs/promises')
  const packageData = { name: 'traditional-test', version: '1.5.0' }
  await fs.writeFile(join(tmpDir, 'package.json'), JSON.stringify(packageData, null, 2))

  const pkg = new Pkg(tmpDir)

  t.is(pkg.get('name'), 'traditional-test')
  t.is(pkg.version.get(), '1.5.0')
})

test('Node Pkg constructor with create option', t => {
  const { tmpDir } = t.context

  const pkg = new Pkg(tmpDir, { create: true })

  t.deepEqual(pkg.data, {})
  t.is(pkg.version.get(), '0.0.0')
})

// SAVE FUNCTIONALITY TESTS

test('Node Pkg saveSync in isomorphic mode', async t => {
  const { tmpDir } = t.context

  const packageData = { name: 'save-test', version: '1.0.0' }
  const pkg = new Pkg(tmpDir, { data: packageData, create: true })

  pkg.set('description', 'Added description')
  pkg.saveSync()

  // Verify file was written
  const fs = await import('fs/promises')
  const savedContent = await fs.readFile(join(tmpDir, 'package.json'), 'utf8')
  const saved = JSON.parse(savedContent)

  t.is(saved.name, 'save-test')
  t.is(saved.description, 'Added description')
})

test('Node Pkg save async in isomorphic mode', async t => {
  const { tmpDir } = t.context

  const packageData = { name: 'async-save-test', version: '2.0.0' }
  const pkg = new Pkg(tmpDir, { data: packageData, create: true })

  pkg.set('author', 'Test Author')
  await pkg.save()

  // Verify file was written
  const fs = await import('fs/promises')
  const savedContent = await fs.readFile(join(tmpDir, 'package.json'), 'utf8')
  const saved = JSON.parse(savedContent)

  t.is(saved.name, 'async-save-test')
  t.is(saved.author, 'Test Author')
})

test('Node Pkg inherits all core functionality', t => {
  const packageData = { name: 'inheritance-test', version: '1.0.0' }
  const pkg = new Pkg({ data: packageData })

  // Test core methods work
  pkg.set('keywords', ['test'])
  pkg.append('keywords', 'node')
  pkg.prepend('keywords', 'first')

  t.deepEqual(pkg.get('keywords'), ['first', 'test', 'node'])

  // Test version methods work
  pkg.version.newMinor()
  t.is(pkg.version.get(), '1.1.0')

  // Test has/del methods work
  t.is(pkg.has('name'), true)
  pkg.del('version')
  t.is(pkg.has('version'), false)
})

// MIXED MODE TESTS

test('Node Pkg can mix isomorphic and filesystem operations', async t => {
  const { tmpDir } = t.context

  // Start with isomorphic data
  const pkg = new Pkg(tmpDir, {
    data: { name: 'mixed-test', version: '1.0.0' },
    create: true
  })

  // Modify the data
  pkg.set('description', 'Mixed mode test')
  pkg.version.newPatch()

  // Save to filesystem
  await pkg.save()

  // Create a new instance from filesystem
  const pkg2 = new Pkg(tmpDir)

  t.is(pkg2.get('name'), 'mixed-test')
  t.is(pkg2.get('description'), 'Mixed mode test')
  t.is(pkg2.version.get(), '1.0.1')
})

// ERROR HANDLING TESTS

test('Node Pkg throws when package not found and create is false', t => {
  const { tmpDir } = t.context

  const error = t.throws(() => new Pkg(tmpDir))
  t.is(error.code, 'ENOENT')
})

test('Node Pkg handles ENOENT when create is true', t => {
  const { tmpDir } = t.context

  t.notThrows(() => new Pkg(tmpDir, { create: true }))
})

// BACKWARD COMPATIBILITY TESTS

test('Node Pkg maintains exact backward compatibility', async t => {
  const { tmpDir } = t.context

  // Test the exact same usage patterns from existing tests
  const pkg = new Pkg(tmpDir, { create: true })

  // Should work exactly like the old API
  pkg.set('foo', 'bar')
  await pkg.save()

  // Verify with manual file read
  const fs = await import('fs/promises')
  const content = await fs.readFile(join(tmpDir, 'package.json'), 'utf8')
  const parsed = JSON.parse(content)

  t.is(parsed.foo, 'bar')
})

test('Node Pkg path property works correctly', t => {
  const { tmpDir } = t.context

  const pkg = new Pkg(tmpDir, { create: true })

  t.is(pkg.path, join(tmpDir, 'package.json'))
})

test('Node Pkg options property is accessible', t => {
  const pkg = new Pkg('./', { create: true })

  t.is(pkg.options.create, true)
})

// EDGE CASES

test('Node Pkg handles null/undefined constructor args gracefully', t => {
  t.notThrows(() => new Pkg())
  t.notThrows(() => new Pkg(undefined))
  t.notThrows(() => new Pkg(undefined, undefined))
})
