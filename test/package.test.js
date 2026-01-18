import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import { join } from 'path'
import { readPackage, readPackageSync, writePackageSync } from '../dist/utils/package-io.js'
import { rimrafSync } from 'rimraf'
import tmp from 'tmp'

import Pkg from '../dist/index.js'

// Context storage for test hooks
const testContext = new Map()

// Create tmp dir for each test
beforeEach((t) => {
  testContext.set(t, { tmpDir: tmp.dirSync().name })
})

// Cleanup tmp dir
afterEach((t) => {
  const context = testContext.get(t)
  if (context) {
    rimrafSync(context.tmpDir)
    testContext.delete(t)
  }
})

// CONSTRUCTOR

test('package not found', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Actions & Expectations
  assert.throws(
    () => new Pkg(tmpDir),
    (err) => {
      assert.strictEqual(err.code, 'ENOENT')
      return true
    }
  )
})

test('create package', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.set('foo', 'bar')
  await pkg.save()

  // Expectations
  const tstPkg = readPackageSync({ cwd: tmpDir })
  assert.strictEqual(tstPkg.foo, 'bar')
})

// PATH

test('get package.json path', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Actions
  const pkg = new Pkg(tmpDir, { create: true })

  // Expectations
  assert.strictEqual(pkg.path, join(tmpDir, 'package.json'))
})

// GET

test('get property', async (t) => {
  // Setup
  const pkg = new Pkg() // => Load real `package.json`

  // Actions
  const pkgName = pkg.get('name')

  // Expectations
  assert.strictEqual(pkgName, 'update-pkg-extended')
})

test('get undefined property (with default value)', async (t) => {
  // Setup
  const pkg = new Pkg() // => Load real `package.json`

  // Actions
  const value = pkg.get('defaultValue', 'default')

  // Expectations
  assert.strictEqual(value, 'default')
})

test('get undefined property (without default value)', async (t) => {
  // Setup
  const pkg = new Pkg() // => Load real `package.json`

  // Actions
  const value = pkg.get('defaultValue')

  // Expectations
  assert.strictEqual(value, undefined)
})

// SET

test('set property', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.set('foo', 'bar')
  await pkg.save()

  // Expectations
  const tstPkg = await readPackage({ cwd: tmpDir })
  assert.strictEqual(tstPkg.foo, 'bar')
})

test('set deep property', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.set('bar.baz', 'foo')
  await pkg.save()

  // Expectations
  const savedPkg = await readPackage({ cwd: tmpDir })
  assert.strictEqual(savedPkg.bar.baz, 'foo')
})

// DEL

test('del property', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })
  pkg.set('baz', 'delete me!')
  await pkg.save()
  const tstPkg = await readPackage({ cwd: tmpDir })
  assert.strictEqual(tstPkg.baz, 'delete me!')

  // Actions
  pkg.del('baz')
  await pkg.save()

  // Expectations
  const savedPackage = await readPackage({ cwd: tmpDir })
  assert.strictEqual(savedPackage.baz, undefined)
})

// HAS

test('has property', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  let variableExists = pkg.has('exists')

  // Expectations
  assert.ok(!variableExists)

  // Reactions
  pkg.set('exists', 'now')

  // Actions
  variableExists = pkg.has('exists')

  // Expectations
  assert.ok(variableExists)
})

// APPEND/PREPEND

test('append', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.append('app', 'a')
  pkg.append('app', 'b')

  await pkg.save()

  // Expectations
  const savedPackage = await readPackage({ cwd: tmpDir })
  assert.deepStrictEqual(savedPackage.app, ['a', 'b'])
})

test('prepend', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.prepend('pre', 'a')
  pkg.prepend('pre', 'b')

  await pkg.save()

  // Expectations
  const savedPackage = await readPackage({ cwd: tmpDir })
  assert.deepStrictEqual(savedPackage.pre, ['b', 'a'])
})

// VERSION

test('version property', async (t) => {
  const { tmpDir } = testContext.get(t)

  // Setup
  _createMockPackage(tmpDir)
  const pkg = new Pkg(tmpDir)

  // Actions
  const version = pkg.version.get()

  // Expectations
  assert.strictEqual(version, '0.0.1')
})

// SAVE

test('saveSync', (t) => {
  const { tmpDir } = testContext.get(t)

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })
  pkg.set('syncSave', 'tested')

  // Actions
  pkg.saveSync()

  // Expectations
  const savedPkg = readPackageSync({ cwd: tmpDir })
  assert.strictEqual(savedPkg.syncSave, 'tested')
})

// Utils

function _createMockPackage (path) {
  writePackageSync(path, { name: 'test-package', version: '0.0.1' })
}
