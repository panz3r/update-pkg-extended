import { test } from 'node:test'
import assert from 'node:assert'
import { Pkg } from '../dist/core-entry.js'

// CONSTRUCTOR TESTS

test('PkgCore constructor with no arguments creates empty package', () => {
  const pkg = new Pkg()

  assert.deepStrictEqual(pkg.data, {})
  assert.strictEqual(pkg.version.get(), '0.0.0')
})

test('PkgCore constructor with package data object', () => {
  const packageData = {
    name: 'test-pkg',
    version: '1.2.3',
    description: 'A test package'
  }

  const pkg = new Pkg(packageData)

  assert.deepStrictEqual(pkg.data, packageData)
  assert.strictEqual(pkg.version.get(), '1.2.3')
  assert.strictEqual(pkg.get('name'), 'test-pkg')
  assert.strictEqual(pkg.get('description'), 'A test package')
})

test('PkgCore constructor with options object', () => {
  const packageData = {
    name: 'test-pkg',
    version: '2.0.0'
  }

  const pkg = new Pkg({ data: packageData })

  assert.deepStrictEqual(pkg.data, packageData)
  assert.strictEqual(pkg.version.get(), '2.0.0')
  assert.strictEqual(pkg.get('name'), 'test-pkg')
})

test('PkgCore constructor with empty options object', () => {
  const pkg = new Pkg({ data: {} })

  assert.deepStrictEqual(pkg.data, {})
  assert.strictEqual(pkg.version.get(), '0.0.0')
})

// PROPERTY MANIPULATION TESTS

test('PkgCore set and get properties', () => {
  const pkg = new Pkg()

  pkg.set('name', 'isomorphic-pkg')
  pkg.set('author.name', 'Test Author')
  pkg.set('author.email', 'test@example.com')

  assert.strictEqual(pkg.get('name'), 'isomorphic-pkg')
  assert.strictEqual(pkg.get('author.name'), 'Test Author')
  assert.strictEqual(pkg.get('author.email'), 'test@example.com')
})

test('PkgCore get with default value', () => {
  const pkg = new Pkg()

  assert.strictEqual(pkg.get('nonexistent', 'default'), 'default')
  assert.strictEqual(pkg.get('nonexistent'), undefined)
})

test('PkgCore update property', () => {
  const pkg = new Pkg({ data: { version: '1.0.0' } })

  pkg.update('version', () => '2.0.0')

  assert.strictEqual(pkg.get('version'), '2.0.0')
})

test('PkgCore append to array property', () => {
  const pkg = new Pkg({ data: { keywords: ['test'] } })

  pkg.append('keywords', 'new-keyword')

  assert.deepStrictEqual(pkg.get('keywords'), ['test', 'new-keyword'])
})

test('PkgCore append to non-existent property', () => {
  const pkg = new Pkg()

  pkg.append('keywords', 'first-keyword')

  assert.deepStrictEqual(pkg.get('keywords'), ['first-keyword'])
})

test('PkgCore prepend to array property', () => {
  const pkg = new Pkg({ data: { keywords: ['existing'] } })

  pkg.prepend('keywords', 'first')

  assert.deepStrictEqual(pkg.get('keywords'), ['first', 'existing'])
})

test('PkgCore prepend to non-existent property', () => {
  const pkg = new Pkg()

  pkg.prepend('keywords', 'first-keyword')

  assert.deepStrictEqual(pkg.get('keywords'), ['first-keyword'])
})

test('PkgCore delete property', () => {
  const pkg = new Pkg({ data: { toDelete: 'value', toKeep: 'value' } })

  pkg.del('toDelete')

  assert.strictEqual(pkg.has('toDelete'), false)
  assert.strictEqual(pkg.has('toKeep'), true)
})

test('PkgCore has property', () => {
  const pkg = new Pkg({ data: { existing: 'value' } })

  assert.strictEqual(pkg.has('existing'), true)
  assert.strictEqual(pkg.has('nonexistent'), false)
})

// VERSION MANIPULATION TESTS

test('PkgCore version manipulation', () => {
  const pkg = new Pkg({ data: { version: '1.0.0' } })

  pkg.version.newMinor()
  assert.strictEqual(pkg.version.get(), '1.1.0')
  assert.strictEqual(pkg.get('version'), '1.1.0')

  pkg.version.newMajor()
  assert.strictEqual(pkg.version.get(), '2.0.0')
  assert.strictEqual(pkg.get('version'), '2.0.0')
})

test('PkgCore version with empty data', () => {
  const pkg = new Pkg()

  pkg.version.major(1)
  pkg.version.minor(2)
  pkg.version.patch(3)

  assert.strictEqual(pkg.version.get(), '1.2.3')
  assert.strictEqual(pkg.get('version'), '1.2.3')
})

// METHOD CHAINING TESTS

test('PkgCore method chaining', () => {
  const pkg = new Pkg()

  const result = pkg
    .set('name', 'chained-pkg')
    .set('version', '1.0.0')
    .append('keywords', 'test')
    .prepend('keywords', 'first')

  assert.strictEqual(result, pkg) // Should return the same instance
  assert.strictEqual(pkg.get('name'), 'chained-pkg')
  assert.deepStrictEqual(pkg.get('keywords'), ['first', 'test'])
})

// STRINGIFY TESTS

test('PkgCore stringify with default spacing', () => {
  const pkg = new Pkg({ data: { name: 'test', version: '1.0.0' } })

  const result = pkg.stringify()
  const expected = JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2) + '\n'

  assert.strictEqual(result, expected)
})

test('PkgCore stringify with custom spacing', () => {
  const pkg = new Pkg({ data: { name: 'test' } })

  const result = pkg.stringify(4)
  const expected = JSON.stringify({ name: 'test' }, null, 4) + '\n'

  assert.strictEqual(result, expected)
})

// DATA ACCESS TESTS

test('PkgCore data property is readable', () => {
  const originalData = { name: 'test-pkg', version: '1.0.0' }
  const pkg = new Pkg(originalData)

  assert.deepStrictEqual(pkg.data, originalData)
})

test('PkgCore data mutations are reflected in data property', () => {
  const pkg = new Pkg({ data: { name: 'test' } })

  pkg.set('version', '2.0.0')

  assert.strictEqual(pkg.data.version, '2.0.0')
  assert.deepStrictEqual(pkg.data, { name: 'test', version: '2.0.0' })
})
