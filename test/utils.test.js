import test from 'ava'
import { getProperty, setProperty, hasProperty, deleteProperty } from '../src/utils/dot-prop.js'
import { readPackage } from '../src/utils/package-io.js'
import parse from '../src/utils/semver.js'

// Test edge cases for 100% coverage

test('getProperty with null object', t => {
  t.is(getProperty(null, 'test', 'default'), 'default')
})

test('hasProperty with null object', t => {
  t.is(hasProperty(null, 'test'), false)
})

test('hasProperty with unsafe property', t => {
  const obj = { test: 'value' }
  t.is(hasProperty(obj, '__proto__'), false)
})

test('setProperty with unsafe intermediate property', t => {
  const obj = {}
  setProperty(obj, '__proto__.test', 'value')
  t.deepEqual(obj, {}) // Should not be modified
})

test('setProperty with unsafe final property', t => {
  const obj = {}
  setProperty(obj, '__proto__', 'value')
  t.deepEqual(obj, {}) // Should not be modified
})

test('deleteProperty with null object', t => {
  t.is(deleteProperty(null, 'test'), false)
})

test('deleteProperty with unsafe property', t => {
  const obj = { test: 'value' }
  t.is(deleteProperty(obj, '__proto__'), false)
})

test('deleteProperty with unsafe intermediate property', t => {
  const obj = { test: { nested: 'value' } }
  t.is(deleteProperty(obj, '__proto__.nested'), false)
})

test('deleteProperty single level property', t => {
  const obj = { test: 'value' }
  t.is(deleteProperty(obj, 'test'), true)
  t.is(obj.test, undefined)
})

test('deleteProperty non-existent single level property', t => {
  const obj = { other: 'value' }
  t.is(deleteProperty(obj, 'test'), false)
})

test('deleteProperty non-existent deep property', t => {
  const obj = { test: { other: 'value' } }
  t.is(deleteProperty(obj, 'test.nonexistent'), false)
})

test('deleteProperty existing deep property', t => {
  const obj = { test: { nested: 'value' } }
  t.is(deleteProperty(obj, 'test.nested'), true)
  t.is(obj.test.nested, undefined)
})

test('readPackage with ENOENT error gets converted', async t => {
  const error = await t.throwsAsync(() => readPackage({ cwd: '/nonexistent' }))
  t.is(error.code, 'ENOENT')
})

test('readPackage with other error gets passed through', async t => {
  // Create a mock that throws a non-ENOENT error
  await t.throwsAsync(() => readPackage({ cwd: '\x00invalid' }))
})

test('semver inc with prerelease increments existing prerelease', t => {
  const version = parse('1.0.0-alpha.1')
  version.inc('prerelease')
  t.is(version.format(), '1.0.0-alpha.2')
})

test('semver inc with prerelease adds number when non-numeric', t => {
  const version = parse('1.0.0-alpha')
  version.inc('prerelease')
  t.is(version.format(), '1.0.0-alpha.0')
})

test('semver inc patch without prerelease', t => {
  const version = parse('1.0.0')
  version.inc('patch')
  t.is(version.format(), '1.0.1')
})

test('semver constructor with null version', t => {
  const version = parse(null)
  t.is(version.format(), '0.0.0')
})

test('semver constructor with undefined version', t => {
  const version = parse(undefined)
  t.is(version.format(), '0.0.0')
})

test('semver parse version with v prefix', t => {
  const version = parse('v1.2.3')
  t.is(version.format(), '1.2.3')
})

test('semver parse version with missing minor and patch', t => {
  const version = parse('1')
  t.is(version.format(), '1.0.0')
})

test('semver parse version with missing patch', t => {
  const version = parse('1.2')
  t.is(version.format(), '1.2.0')
})

test('semver inc prerelease with non-numeric last item', t => {
  const version = parse('1.0.0-alpha.beta')
  version.inc('prerelease')
  t.is(version.format(), '1.0.0-alpha.beta.0')
})

test('setProperty creates intermediate object when current property is null', t => {
  const obj = { test: null }
  setProperty(obj, 'test.nested', 'value')
  t.deepEqual(obj, { test: { nested: 'value' } })
})

test('setProperty creates intermediate object when current property is not an object', t => {
  const obj = { test: 'string' }
  setProperty(obj, 'test.nested', 'value')
  t.deepEqual(obj, { test: { nested: 'value' } })
})

test('semver parse version with empty segments', t => {
  const version = parse('1..3')
  t.is(version.format(), '1.0.3')
})

test('semver parse version with empty trailing segments', t => {
  const version = parse('1.2.')
  t.is(version.format(), '1.2.0')
})

test('semver parse version with empty major segment', t => {
  const version = parse('.1.2')
  t.is(version.format(), '0.1.2')
})

test('semver inc prerelease with complex non-numeric last item', t => {
  const version = parse('1.0.0-alpha.beta-gamma')
  version.inc('prerelease')
  t.is(version.format(), '1.0.0-alpha.beta.0')
})

test('semver inc prerelease with string numeric last item', t => {
  // Test case where last prerelease item is a string that looks like a number
  const version = parse('1.0.0-alpha.5')
  version.inc('prerelease')
  t.is(version.format(), '1.0.0-alpha.6')
})

test('semver inc prerelease with actual numeric last item', t => {
  // Test case where we explicitly have a numeric last item
  const version = parse('1.0.0-beta.3')
  // Manually modify prerelease to have a number instead of string
  version.prerelease = ['beta', 3]
  version.inc('prerelease')
  t.is(version.format(), '1.0.0-beta.4')
})
