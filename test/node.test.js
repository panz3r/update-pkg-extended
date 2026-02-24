import assert from 'node:assert'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, test } from 'node:test'

import { Pkg } from '../dist/node.js'

// Context storage for test hooks
const testContext = new Map()

// Create tmp dir for each test
beforeEach((t) => {
  testContext.set(t, { tmpDir: mkdtempSync(join(tmpdir(), 'update-pkg-extended-')) })
})

// Cleanup tmp dir
afterEach((t) => {
  const context = testContext.get(t)
  if (context) {
    rmSync(context.tmpDir, { recursive: true, force: true })
    testContext.delete(t)
  }
})

// CONSTRUCTOR TESTS

test('Node Pkg constructor with data option (isomorphic mode)', (t) => {
  const packageData = {
    name: 'isomorphic-test',
    version: '1.0.0',
    description: 'Testing isomorphic mode'
  }

  const pkg = new Pkg('./', { data: packageData })

  assert.deepStrictEqual(pkg.data, packageData)
  assert.strictEqual(pkg.get('name'), 'isomorphic-test')
  assert.strictEqual(pkg.version.get(), '1.0.0')
  assert.ok(pkg.path) // Should still have a path even in isomorphic mode
})

test('Node Pkg constructor with options-only (isomorphic mode)', (t) => {
  const packageData = { name: 'test-pkg', version: '2.0.0' }

  const pkg = new Pkg({ data: packageData, create: true })

  assert.deepStrictEqual(pkg.data, packageData)
  assert.strictEqual(pkg.get('name'), 'test-pkg')
  assert.strictEqual(pkg.version.get(), '2.0.0')
})

test('Node Pkg constructor traditional mode works', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Create a package.json file
  const fs = await import('fs/promises')
  const packageData = { name: 'traditional-test', version: '1.5.0' }
  await fs.writeFile(join(tmpDir, 'package.json'), JSON.stringify(packageData, null, 2))

  const pkg = new Pkg(tmpDir)

  assert.strictEqual(pkg.get('name'), 'traditional-test')
  assert.strictEqual(pkg.version.get(), '1.5.0')
})

test('Node Pkg constructor with create option', (t) => {
  const { tmpDir } = testContext.get(t)

  const pkg = new Pkg(tmpDir, { create: true })

  assert.deepStrictEqual(pkg.data, {})
  assert.strictEqual(pkg.version.get(), '0.0.0')
})

// SAVE FUNCTIONALITY TESTS

test('Node Pkg saveSync in isomorphic mode', async (t) => {
  const { tmpDir } = testContext.get(t)

  const packageData = { name: 'save-test', version: '1.0.0' }
  const pkg = new Pkg(tmpDir, { data: packageData, create: true })

  pkg.set('description', 'Added description')
  pkg.saveSync()

  // Verify file was written
  const fs = await import('fs/promises')
  const savedContent = await fs.readFile(join(tmpDir, 'package.json'), 'utf8')
  const saved = JSON.parse(savedContent)

  assert.strictEqual(saved.name, 'save-test')
  assert.strictEqual(saved.description, 'Added description')
})

test('Node Pkg save async in isomorphic mode', async (t) => {
  const { tmpDir } = testContext.get(t)

  const packageData = { name: 'async-save-test', version: '2.0.0' }
  const pkg = new Pkg(tmpDir, { data: packageData, create: true })

  pkg.set('author', 'Test Author')
  await pkg.save()

  // Verify file was written
  const fs = await import('fs/promises')
  const savedContent = await fs.readFile(join(tmpDir, 'package.json'), 'utf8')
  const saved = JSON.parse(savedContent)

  assert.strictEqual(saved.name, 'async-save-test')
  assert.strictEqual(saved.author, 'Test Author')
})

test('Node Pkg inherits all core functionality', (t) => {
  const packageData = { name: 'inheritance-test', version: '1.0.0' }
  const pkg = new Pkg({ data: packageData })

  // Test core methods work
  pkg.set('keywords', ['test'])
  pkg.append('keywords', 'node')
  pkg.prepend('keywords', 'first')

  assert.deepStrictEqual(pkg.get('keywords'), ['first', 'test', 'node'])

  // Test version methods work
  pkg.version.newMinor()
  assert.strictEqual(pkg.version.get(), '1.1.0')

  // Test has/del methods work
  assert.strictEqual(pkg.has('name'), true)
  pkg.del('version')
  assert.strictEqual(pkg.has('version'), false)
})

// MIXED MODE TESTS

test('Node Pkg can mix isomorphic and filesystem operations', async (t) => {
  const { tmpDir } = testContext.get(t)

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

  assert.strictEqual(pkg2.get('name'), 'mixed-test')
  assert.strictEqual(pkg2.get('description'), 'Mixed mode test')
  assert.strictEqual(pkg2.version.get(), '1.0.1')
})

// ERROR HANDLING TESTS

test('Node Pkg throws when package not found and create is false', (t) => {
  const { tmpDir } = testContext.get(t)

  assert.throws(
    () => new Pkg(tmpDir),
    (err) => {
      assert.strictEqual(err.code, 'ENOENT')
      return true
    }
  )
})

test('Node Pkg handles ENOENT when create is true', (t) => {
  const { tmpDir } = testContext.get(t)

  assert.doesNotThrow(() => new Pkg(tmpDir, { create: true }))
})

// BACKWARD COMPATIBILITY TESTS

test('Node Pkg maintains exact backward compatibility', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Test the exact same usage patterns from existing tests
  const pkg = new Pkg(tmpDir, { create: true })

  // Should work exactly like the old API
  pkg.set('foo', 'bar')
  await pkg.save()

  // Verify with manual file read
  const fs = await import('fs/promises')
  const content = await fs.readFile(join(tmpDir, 'package.json'), 'utf8')
  const parsed = JSON.parse(content)

  assert.strictEqual(parsed.foo, 'bar')
})

test('Node Pkg path property works correctly', (t) => {
  const { tmpDir } = testContext.get(t)

  const pkg = new Pkg(tmpDir, { create: true })

  assert.strictEqual(pkg.path, join(tmpDir, 'package.json'))
})

test('Node Pkg options property is accessible', (t) => {
  const pkg = new Pkg('./', { create: true })

  assert.strictEqual(pkg.options.create, true)
})

// EDGE CASES

test('Node Pkg handles null/undefined constructor args gracefully', (t) => {
  assert.doesNotThrow(() => new Pkg())
  assert.doesNotThrow(() => new Pkg(undefined))
  assert.doesNotThrow(() => new Pkg(undefined, undefined))
})
