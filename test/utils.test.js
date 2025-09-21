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
