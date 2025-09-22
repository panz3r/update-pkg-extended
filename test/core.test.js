import test from 'ava'
import { PkgCore } from '../dist/core.js'

// CONSTRUCTOR TESTS

test('PkgCore constructor with no arguments creates empty package', t => {
  const pkg = new PkgCore()

  t.deepEqual(pkg.data, {})
  t.is(pkg.version.get(), '0.0.0')
})

test('PkgCore constructor with package data object', t => {
  const packageData = {
    name: 'test-pkg',
    version: '1.2.3',
    description: 'A test package'
  }

  const pkg = new PkgCore(packageData)

  t.deepEqual(pkg.data, packageData)
  t.is(pkg.version.get(), '1.2.3')
  t.is(pkg.get('name'), 'test-pkg')
  t.is(pkg.get('description'), 'A test package')
})

test('PkgCore constructor with options object', t => {
  const packageData = {
    name: 'test-pkg',
    version: '2.0.0'
  }

  const pkg = new PkgCore({ data: packageData })

  t.deepEqual(pkg.data, packageData)
  t.is(pkg.version.get(), '2.0.0')
  t.is(pkg.get('name'), 'test-pkg')
})

test('PkgCore constructor with empty options object', t => {
  const pkg = new PkgCore({ data: {} })

  t.deepEqual(pkg.data, {})
  t.is(pkg.version.get(), '0.0.0')
})

// PROPERTY MANIPULATION TESTS

test('PkgCore set and get properties', t => {
  const pkg = new PkgCore()

  pkg.set('name', 'isomorphic-pkg')
  pkg.set('author.name', 'Test Author')
  pkg.set('author.email', 'test@example.com')

  t.is(pkg.get('name'), 'isomorphic-pkg')
  t.is(pkg.get('author.name'), 'Test Author')
  t.is(pkg.get('author.email'), 'test@example.com')
})

test('PkgCore get with default value', t => {
  const pkg = new PkgCore()

  t.is(pkg.get('nonexistent', 'default'), 'default')
  t.is(pkg.get('nonexistent'), undefined)
})

test('PkgCore update property', t => {
  const pkg = new PkgCore({ data: { version: '1.0.0' } })

  pkg.update('version', (v) => '2.0.0')

  t.is(pkg.get('version'), '2.0.0')
})

test('PkgCore append to array property', t => {
  const pkg = new PkgCore({ data: { keywords: ['test'] } })

  pkg.append('keywords', 'new-keyword')

  t.deepEqual(pkg.get('keywords'), ['test', 'new-keyword'])
})

test('PkgCore append to non-existent property', t => {
  const pkg = new PkgCore()

  pkg.append('keywords', 'first-keyword')

  t.deepEqual(pkg.get('keywords'), ['first-keyword'])
})

test('PkgCore prepend to array property', t => {
  const pkg = new PkgCore({ data: { keywords: ['existing'] } })

  pkg.prepend('keywords', 'first')

  t.deepEqual(pkg.get('keywords'), ['first', 'existing'])
})

test('PkgCore prepend to non-existent property', t => {
  const pkg = new PkgCore()

  pkg.prepend('keywords', 'first-keyword')

  t.deepEqual(pkg.get('keywords'), ['first-keyword'])
})

test('PkgCore delete property', t => {
  const pkg = new PkgCore({ data: { toDelete: 'value', toKeep: 'value' } })

  pkg.del('toDelete')

  t.is(pkg.has('toDelete'), false)
  t.is(pkg.has('toKeep'), true)
})

test('PkgCore has property', t => {
  const pkg = new PkgCore({ data: { existing: 'value' } })

  t.is(pkg.has('existing'), true)
  t.is(pkg.has('nonexistent'), false)
})

// VERSION MANIPULATION TESTS

test('PkgCore version manipulation', t => {
  const pkg = new PkgCore({ data: { version: '1.0.0' } })

  pkg.version.newMinor()
  t.is(pkg.version.get(), '1.1.0')
  t.is(pkg.get('version'), '1.1.0')

  pkg.version.newMajor()
  t.is(pkg.version.get(), '2.0.0')
  t.is(pkg.get('version'), '2.0.0')
})

test('PkgCore version with empty data', t => {
  const pkg = new PkgCore()

  pkg.version.major(1)
  pkg.version.minor(2)
  pkg.version.patch(3)

  t.is(pkg.version.get(), '1.2.3')
  t.is(pkg.get('version'), '1.2.3')
})

// METHOD CHAINING TESTS

test('PkgCore method chaining', t => {
  const pkg = new PkgCore()

  const result = pkg
    .set('name', 'chained-pkg')
    .set('version', '1.0.0')
    .append('keywords', 'test')
    .prepend('keywords', 'first')

  t.is(result, pkg) // Should return the same instance
  t.is(pkg.get('name'), 'chained-pkg')
  t.deepEqual(pkg.get('keywords'), ['first', 'test'])
})

// STRINGIFY TESTS

test('PkgCore stringify with default spacing', t => {
  const pkg = new PkgCore({ data: { name: 'test', version: '1.0.0' } })

  const result = pkg.stringify()
  const expected = JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2) + '\n'

  t.is(result, expected)
})

test('PkgCore stringify with custom spacing', t => {
  const pkg = new PkgCore({ data: { name: 'test' } })

  const result = pkg.stringify(4)
  const expected = JSON.stringify({ name: 'test' }, null, 4) + '\n'

  t.is(result, expected)
})

// DATA ACCESS TESTS

test('PkgCore data property is readable', t => {
  const originalData = { name: 'test-pkg', version: '1.0.0' }
  const pkg = new PkgCore(originalData)

  t.deepEqual(pkg.data, originalData)
})

test('PkgCore data mutations are reflected in data property', t => {
  const pkg = new PkgCore({ data: { name: 'test' } })

  pkg.set('version', '2.0.0')

  t.is(pkg.data.version, '2.0.0')
  t.deepEqual(pkg.data, { name: 'test', version: '2.0.0' })
})
