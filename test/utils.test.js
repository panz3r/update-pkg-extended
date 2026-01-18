import { test } from 'node:test'
import assert from 'node:assert'
import { getProperty, setProperty, hasProperty, deleteProperty } from '../dist/utils/dot-prop.js'
import { readPackage } from '../dist/utils/package-io.js'
import parse from '../dist/utils/semver.js'

// Test edge cases for 100% coverage

test('getProperty with null object', () => {
  assert.strictEqual(getProperty(null, 'test', 'default'), 'default')
})

test('hasProperty with null object', () => {
  assert.strictEqual(hasProperty(null, 'test'), false)
})

test('hasProperty with unsafe property', () => {
  const obj = { test: 'value' }
  assert.strictEqual(hasProperty(obj, '__proto__'), false)
})

test('setProperty with unsafe intermediate property', () => {
  const obj = {}
  setProperty(obj, '__proto__.test', 'value')
  assert.deepStrictEqual(obj, {}) // Should not be modified
})

test('setProperty with unsafe final property', () => {
  const obj = {}
  setProperty(obj, '__proto__', 'value')
  assert.deepStrictEqual(obj, {}) // Should not be modified
})

test('deleteProperty with null object', () => {
  assert.strictEqual(deleteProperty(null, 'test'), false)
})

test('deleteProperty with unsafe property', () => {
  const obj = { test: 'value' }
  assert.strictEqual(deleteProperty(obj, '__proto__'), false)
})

test('deleteProperty with unsafe intermediate property', () => {
  const obj = { test: { nested: 'value' } }
  assert.strictEqual(deleteProperty(obj, '__proto__.nested'), false)
})

test('deleteProperty single level property', () => {
  const obj = { test: 'value' }
  assert.strictEqual(deleteProperty(obj, 'test'), true)
  assert.strictEqual(obj.test, undefined)
})

test('deleteProperty non-existent single level property', () => {
  const obj = { other: 'value' }
  assert.strictEqual(deleteProperty(obj, 'test'), false)
})

test('deleteProperty non-existent deep property', () => {
  const obj = { test: { other: 'value' } }
  assert.strictEqual(deleteProperty(obj, 'test.nonexistent'), false)
})

test('deleteProperty existing deep property', () => {
  const obj = { test: { nested: 'value' } }
  assert.strictEqual(deleteProperty(obj, 'test.nested'), true)
  assert.strictEqual(obj.test.nested, undefined)
})

test('readPackage with ENOENT error gets converted', async () => {
  await assert.rejects(
    () => readPackage({ cwd: '/nonexistent' }),
    (error) => {
      assert.strictEqual(error.code, 'ENOENT')
      return true
    }
  )
})

test('readPackage with other error gets passed through', async () => {
  // Create a mock that throws a non-ENOENT error
  await assert.rejects(() => readPackage({ cwd: '\x00invalid' }))
})

test('semver inc with prerelease increments existing prerelease', () => {
  const version = parse('1.0.0-alpha.1')
  version.inc('prerelease')
  assert.strictEqual(version.format(), '1.0.0-alpha.2')
})

test('semver inc with prerelease adds number when non-numeric', () => {
  const version = parse('1.0.0-alpha')
  version.inc('prerelease')
  assert.strictEqual(version.format(), '1.0.0-alpha.0')
})

test('semver inc patch without prerelease', () => {
  const version = parse('1.0.0')
  version.inc('patch')
  assert.strictEqual(version.format(), '1.0.1')
})

test('semver constructor with null version', () => {
  const version = parse(null)
  assert.strictEqual(version.format(), '0.0.0')
})

test('semver constructor with undefined version', () => {
  const version = parse(undefined)
  assert.strictEqual(version.format(), '0.0.0')
})

test('semver parse version with v prefix', () => {
  const version = parse('v1.2.3')
  assert.strictEqual(version.format(), '1.2.3')
})

test('semver parse version with missing minor and patch', () => {
  const version = parse('1')
  assert.strictEqual(version.format(), '1.0.0')
})

test('semver parse version with missing patch', () => {
  const version = parse('1.2')
  assert.strictEqual(version.format(), '1.2.0')
})

test('semver inc prerelease with non-numeric last item', () => {
  const version = parse('1.0.0-alpha.beta')
  version.inc('prerelease')
  assert.strictEqual(version.format(), '1.0.0-alpha.beta.0')
})

test('setProperty creates intermediate object when current property is null', () => {
  const obj = { test: null }
  setProperty(obj, 'test.nested', 'value')
  assert.deepStrictEqual(obj, { test: { nested: 'value' } })
})

test('setProperty creates intermediate object when current property is not an object', () => {
  const obj = { test: 'string' }
  setProperty(obj, 'test.nested', 'value')
  assert.deepStrictEqual(obj, { test: { nested: 'value' } })
})

test('semver parse version with empty segments', () => {
  const version = parse('1..3')
  assert.strictEqual(version.format(), '1.0.3')
})

test('semver parse version with empty trailing segments', () => {
  const version = parse('1.2.')
  assert.strictEqual(version.format(), '1.2.0')
})

test('semver parse version with empty major segment', () => {
  const version = parse('.1.2')
  assert.strictEqual(version.format(), '0.1.2')
})

test('semver inc prerelease with complex non-numeric last item', () => {
  const version = parse('1.0.0-alpha.beta-gamma')
  version.inc('prerelease')
  assert.strictEqual(version.format(), '1.0.0-alpha.beta.0')
})

test('semver inc prerelease with string numeric last item', () => {
  // Test case where last prerelease item is a string that looks like a number
  const version = parse('1.0.0-alpha.5')
  version.inc('prerelease')
  assert.strictEqual(version.format(), '1.0.0-alpha.6')
})

test('semver inc prerelease with actual numeric last item', () => {
  // Test case where we explicitly have a numeric last item
  const version = parse('1.0.0-beta.3')
  // Manually modify prerelease to have a number instead of string
  version.prerelease = ['beta', 3]
  version.inc('prerelease')
  assert.strictEqual(version.format(), '1.0.0-beta.4')
})
