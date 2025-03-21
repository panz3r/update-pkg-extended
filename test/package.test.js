import test from 'ava'
import { join } from 'path'
import { readPackage, readPackageSync } from 'read-pkg'
import { rimrafSync } from 'rimraf'
import tmp from 'tmp'
import { writePackageSync } from 'write-package'

import Pkg from '../src/index.js'

// Create tmp dir for each test
test.beforeEach(t => {
  t.context.tmpDir = tmp.dirSync().name
})

// Cleanup tmp dir
test.afterEach.always(t => {
  rimrafSync(t.context.tmpDir)
})

// CONSTRUCTOR

test('package not found', async t => {
  const { tmpDir } = t.context

  // Actions
  const err = t.throws(() => new Pkg(tmpDir))

  // Expectations
  t.is(err.code, 'ENOENT')
})

test('create package', async t => {
  const { tmpDir } = t.context

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.set('foo', 'bar')
  await pkg.save()

  // Expectations
  const tstPkg = readPackageSync({ cwd: tmpDir })
  t.is(tstPkg.foo, 'bar')
})

// PATH

test('get package.json path', async t => {
  const { tmpDir } = t.context

  // Actions
  const pkg = new Pkg(tmpDir, { create: true })

  // Expectations
  t.is(pkg.path, join(tmpDir, 'package.json'))
})

// GET

test('get property', async t => {
  // Setup
  const pkg = new Pkg() // => Load real `package.json`

  // Actions
  const pkgName = pkg.get('name')

  // Expectations
  t.is(pkgName, 'update-pkg-extended')
})

test('get undefined property (with default value)', async t => {
  // Setup
  const pkg = new Pkg() // => Load real `package.json`

  // Actions
  const value = pkg.get('defaultValue', 'default')

  // Expectations
  t.is(value, 'default')
})

test('get undefined property (without default value)', async t => {
  // Setup
  const pkg = new Pkg() // => Load real `package.json`

  // Actions
  const value = pkg.get('defaultValue')

  // Expectations
  t.is(value, undefined)
})

// SET

test('set property', async t => {
  const { tmpDir } = t.context

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.set('foo', 'bar')
  await pkg.save()

  // Expectations
  const tstPkg = await readPackage({ cwd: tmpDir })
  t.is(tstPkg.foo, 'bar')
})

test('set deep property', async t => {
  const { tmpDir } = t.context

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.set('bar.baz', 'foo')
  await pkg.save()

  // Expectations
  const savedPkg = await readPackage({ cwd: tmpDir })
  t.is(savedPkg.bar.baz, 'foo')
})

// DEL

test('del property', async t => {
  const { tmpDir } = t.context

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })
  pkg.set('baz', 'delete me!')
  await pkg.save()
  const tstPkg = await readPackage({ cwd: tmpDir })
  t.is(tstPkg.baz, 'delete me!')

  // Actions
  pkg.del('baz')
  await pkg.save()

  // Expectations
  const savedPackage = await readPackage({ cwd: tmpDir })
  t.is(savedPackage.baz, undefined)
})

// HAS

test('has property', async t => {
  const { tmpDir } = t.context

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  let variableExists = pkg.has('exists')

  // Expectations
  t.falsy(variableExists)

  // Reactions
  pkg.set('exists', 'now')

  // Actions
  variableExists = pkg.has('exists')

  // Expectations
  t.truthy(variableExists)
})

// APPEND/PREPEND

test('append', async t => {
  const { tmpDir } = t.context

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.append('app', 'a')
  pkg.append('app', 'b')

  await pkg.save()

  // Expectations
  const savedPackage = await readPackage({ cwd: tmpDir })
  t.deepEqual(savedPackage.app, ['a', 'b'])
})

test('prepend', async t => {
  const { tmpDir } = t.context

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })

  // Actions
  pkg.prepend('pre', 'a')
  pkg.prepend('pre', 'b')

  await pkg.save()

  // Expectations
  const savedPackage = await readPackage({ cwd: tmpDir })
  t.deepEqual(savedPackage.pre, ['b', 'a'])
})

// VERSION

test('version property', async t => {
  const { tmpDir } = t.context

  // Setup
  _createMockPackage(tmpDir)
  const pkg = new Pkg(tmpDir)

  // Actions
  const version = pkg.version.get()

  // Expectations
  t.is(version, '0.0.1')
})

// SAVE

test('saveSync', t => {
  const { tmpDir } = t.context

  // Setup
  const pkg = new Pkg(tmpDir, { create: true })
  pkg.set('syncSave', 'tested')

  // Actions
  pkg.saveSync()

  // Expectations
  const savedPkg = readPackageSync({ cwd: tmpDir })
  t.is(savedPkg.syncSave, 'tested')
})

// Utils

function _createMockPackage (path) {
  writePackageSync(path, { name: 'test-package', version: '0.0.1' })
}
