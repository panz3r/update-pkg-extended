import test from 'ava'
import { mkdtempSync, writeFileSync } from 'fs'
import { sync as rm } from 'rimraf'
import { join, sep } from 'path'
import Pkg from '../'

const testDir = join(__dirname, sep)
const testPackage = join(testDir, './package.json')
const notExistingPath = join(__dirname, '/not-existing')
const fixturePath = mkdtempSync(testDir)
const fixturePackage = join(fixturePath, './package.json')

test.before('create test package.json', t => {
  writeFileSync(testPackage, JSON.stringify({ name: 'test package', version: '0.0.1' }), 'utf8')
})

test('package not found', async t => {
  // Actions
  const err = t.throws(() => new Pkg(fixturePath))

  // Expectations
  t.is(err.code, 'MODULE_NOT_FOUND')
})

test('create package (not-existing path)', async t => {
  // Actions
  const pkg = new Pkg(notExistingPath, { create: true })
  pkg.set('foo', 'bar')
  await pkg.save()

  // Expectations
  t.is(require(join(notExistingPath, './package.json')).foo, 'bar')
})

test('create package', async t => {
  // Actions
  const pkg = new Pkg(fixturePath, { create: true })
  pkg.set('foo', 'bar')
  await pkg.save()

  // Expectations
  t.is(require(fixturePackage).foo, 'bar')
})

test('get property', async t => {
  // Setup
  const pkg = new Pkg() // => Load real `package.json`

  // Actions
  const pkgName = pkg.get('name')

  // Expectations
  t.is(pkgName, 'update-pkg-extended')
})

test('set property', async t => {
  // Setup
  const pkg = new Pkg(testDir)

  // Actions
  pkg.set('foo', 'bar')
  await pkg.save()

  // Expectations
  t.is(require(testPackage).foo, 'bar')
})

test('set deep property', async t => {
  // Setup
  const pkg = new Pkg(testDir)

  // Actions
  pkg.set('bar.baz', 'foo')
  await pkg.save()

  // Expectations
  t.is(require(testPackage).bar.baz, 'foo')
})

test('del property', async t => {
  // Setup
  const pkg = new Pkg(testDir)
  pkg.set('baz', 'delete me!')
  await pkg.save()
  t.is(require(testPackage).baz, 'delete me!')

  // Actions
  pkg.del('baz')
  await pkg.save()

  // Expectations
  t.is(require(testPackage).baz, undefined)
})

test('has property', async t => {
  // Setup
  const pkg = new Pkg(testDir)

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

test('version property', async t => {
  // Setup
  const pkg = new Pkg(testDir)

  // Actions
  const version = pkg.version.get()

  // Expectations
  t.is(version, '0.0.1')
})

test('saveSync', t => {
  // Setup
  const pkg = new Pkg(testDir)
  pkg.set('asyncSave', 'tested')

  // Actions
  pkg.saveSync()

  // Expectations
  t.is(require(testPackage).asyncSave, 'tested')
})

// Cleanup
test.after.always('cleanup', t => {
  rm(testPackage)
  rm(fixturePath)
  rm(notExistingPath)
})
