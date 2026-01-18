import { test } from 'node:test'
import assert from 'node:assert'

import Version from '../dist/version.js'

const sampleDataNoVer = { name: 'test package' }
const sampleData = { name: 'test package', version: '0.0.1' }

test('version setup (without data)', () => {
  // Setup
  const version = new Version()

  // Expectations
  assert.strictEqual(version.get(), '0.0.0')
})

test('version setup (with data without version)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleDataNoVer))

  // Expectations
  assert.strictEqual(version.get(), '0.0.0')
})

test('get version', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  assert.strictEqual(version.get(), '0.0.1')
})

test('get Major version segment', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  assert.strictEqual(version.get('major'), '0')
})

test('get Minor version segment', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  assert.strictEqual(version.get('minor'), '0')
})

test('get Patch version segment', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  assert.strictEqual(version.get('patch'), '1')
})

test('newMajor version', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMajor()

  // Expectations
  assert.strictEqual(version.get(), '1.0.0')
})

test('major version (increment)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.major()

  // Expectations
  assert.strictEqual(version.get(), '1.0.1')
})

test('major version (set)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.major(3)

  // Expectations
  assert.strictEqual(version.get(), '3.0.1')
})

test('major version (set null)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.major(null)

  // Expectations
  assert.strictEqual(version.get(), '1.0.1')
})

test('newMinor version', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMinor()

  // Expectations
  assert.strictEqual(version.get(), '0.1.0')
})

test('newMinor version (after newMajor)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMajor().newMinor()

  // Expectations
  assert.strictEqual(version.get(), '1.1.0')
})

test('minor version (increment)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.minor()

  // Expectations
  assert.strictEqual(version.get(), '0.1.1')
})

test('minor version (set)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.minor(3)

  // Expectations
  assert.strictEqual(version.get(), '0.3.1')
})

test('minor version (set null)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.minor(null)

  // Expectations
  assert.strictEqual(version.get(), '0.1.1')
})

test('patch version (increment)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.patch()

  // Expectations
  assert.strictEqual(version.get(), '0.0.2')
})

test('patch version (set)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.patch(3)

  // Expectations
  assert.strictEqual(version.get(), '0.0.3')
})

test('patch version (set null)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.patch(null)

  // Expectations
  assert.strictEqual(version.get(), '0.0.2')
})

test('patch version (after newMajor)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMajor().patch()

  // Expectations
  assert.strictEqual(version.get(), '1.0.1')
})

test('patch version (after newMinor)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMinor().patch()

  // Expectations
  assert.strictEqual(version.get(), '0.1.1')
})

test('patch version (after newMajor and newMinor)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMajor().newMinor().patch()

  // Expectations
  assert.strictEqual(version.get(), '1.1.1')
})

const preReleaseSampleDataNumeric = { name: 'test package', version: '1.0.0-0.3.7' }
const preReleaseSampleDataAlpha = { name: 'test package', version: '1.0.0-alpha' }
const preReleaseSampleDataAlphaNumeric = { name: 'test package', version: '1.0.0-alpha.1' }
const preReleaseSampleDataMixed = { name: 'test package', version: '1.0.0-x.7.z.92' }

test('preRelease (get)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataAlphaNumeric))

  // Expectations
  assert.strictEqual(version.get('prerelease'), 'alpha.1')
})

test('preRelease (get null)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  assert.strictEqual(version.get('prerelease'), null)
})

test('preRelease (get - backward compatibility with typo)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataAlphaNumeric))

  // Expectations - should still work with the old typo for backward compatibility
  assert.strictEqual(version.get('prelease'), 'alpha.1')
})

test('preRelease (get null - backward compatibility with typo)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations - should still work with the old typo for backward compatibility
  assert.strictEqual(version.get('prelease'), null)
})

test('preRelease (should handle numeric preRelease)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataNumeric))

  // Expectations
  assert.strictEqual(version.get(), preReleaseSampleDataNumeric.version)
})

test('preRelease (should handle alphabetic preRelease)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataAlpha))

  // Expectations
  assert.strictEqual(version.get(), preReleaseSampleDataAlpha.version)
})

test('preRelease (should handle alphaNumeric preRelease)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataAlphaNumeric))

  // Expectations
  assert.strictEqual(version.get(), preReleaseSampleDataAlphaNumeric.version)
})

test('preRelease (should handle mixed preRelease)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataMixed))

  // Expectations
  assert.strictEqual(version.get(), preReleaseSampleDataMixed.version)
})

test('preRelease (should remove when updating Major)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataNumeric))

  // Actions
  version.newMajor()

  // Expectations
  assert.strictEqual(version.get(), '1.0.0')
})

test('preRelease (should remove when updating minor)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataNumeric))

  // Actions
  version.newMinor()

  // Expectations
  assert.strictEqual(version.get(), '1.0.0')
})

test('preRelease (should remove when updating patch)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataNumeric))

  // Actions
  version.newPatch()

  // Expectations
  assert.strictEqual(version.get(), '1.0.0')
})

test('preRelease (increment)', () => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataAlphaNumeric))

  // Actions
  version.prerelease('alpha')

  // Expectations
  assert.strictEqual(version.get(), '1.0.0-alpha.2')
})

test('preRelease (increment not set)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.prerelease('beta')

  // Expectations
  assert.strictEqual(version.get(), '0.0.2-beta.0')
})

test('preRelease (set)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.prerelease('beta', 9)

  // Expectations
  assert.strictEqual(version.get(), '0.0.1-beta.9')
})

test('preRelease (missing argument)', () => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  assert.throws(() => {
    version.prerelease()
  })
})
