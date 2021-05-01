import test from 'ava'

import Version from '../src/version.js'

const sampleDataNoVer = { name: 'test package' }
const sampleData = { name: 'test package', version: '0.0.1' }

test('version setup (without data)', t => {
  // Setup
  const version = new Version()

  // Expectations
  t.is(version.get(), '0.0.0')
})

test('version setup (with data without version)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleDataNoVer))

  // Expectations
  t.is(version.get(), '0.0.0')
})

test('get version', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  t.is(version.get(), '0.0.1')
})

test('get Major version segment', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  t.is(version.get('major'), '0')
})

test('get Minor version segment', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  t.is(version.get('minor'), '0')
})

test('get Patch version segment', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  t.is(version.get('patch'), '1')
})

test('newMajor version', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMajor()

  // Expectations
  t.is(version.get(), '1.0.0')
})

test('major version (increment)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.major()

  // Expectations
  t.is(version.get(), '1.0.1')
})

test('major version (set)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.major(3)

  // Expectations
  t.is(version.get(), '3.0.1')
})

test('major version (set null)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.major(null)

  // Expectations
  t.is(version.get(), '1.0.1')
})

test('newMinor version', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMinor()

  // Expectations
  t.is(version.get(), '0.1.0')
})

test('newMinor version (after newMajor)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMajor().newMinor()

  // Expectations
  t.is(version.get(), '1.1.0')
})

test('minor version (increment)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.minor()

  // Expectations
  t.is(version.get(), '0.1.1')
})

test('minor version (set)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.minor(3)

  // Expectations
  t.is(version.get(), '0.3.1')
})

test('minor version (set null)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.minor(null)

  // Expectations
  t.is(version.get(), '0.1.1')
})

test('patch version (increment)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.patch()

  // Expectations
  t.is(version.get(), '0.0.2')
})

test('patch version (set)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.patch(3)

  // Expectations
  t.is(version.get(), '0.0.3')
})

test('patch version (set null)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.patch(null)

  // Expectations
  t.is(version.get(), '0.0.2')
})

test('patch version (after newMajor)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMajor().patch()

  // Expectations
  t.is(version.get(), '1.0.1')
})

test('patch version (after newMinor)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMinor().patch()

  // Expectations
  t.is(version.get(), '0.1.1')
})

test('patch version (after newMajor and newMinor)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.newMajor().newMinor().patch()

  // Expectations
  t.is(version.get(), '1.1.1')
})

const preReleaseSampleDataNumeric = { name: 'test package', version: '1.0.0-0.3.7' }
const preReleaseSampleDataAlpha = { name: 'test package', version: '1.0.0-alpha' }
const preReleaseSampleDataAlphaNumeric = { name: 'test package', version: '1.0.0-alpha.1' }
const preReleaseSampleDataMixed = { name: 'test package', version: '1.0.0-x.7.z.92' }

test('preRelease (get)', t => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataAlphaNumeric))

  // Expectations
  t.is(version.get('prelease'), 'alpha.1')
})

test('preRelease (get null)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  t.is(version.get('prelease'), null)
})

test('preRelease (should handle numeric preRelease)', t => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataNumeric))

  // Expectations
  t.is(version.get(), preReleaseSampleDataNumeric.version)
})

test('preRelease (should handle alphabetic preRelease)', t => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataAlpha))

  // Expectations
  t.is(version.get(), preReleaseSampleDataAlpha.version)
})

test('preRelease (should handle alphaNumeric preRelease)', t => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataAlphaNumeric))

  // Expectations
  t.is(version.get(), preReleaseSampleDataAlphaNumeric.version)
})

test('preRelease (should handle mixed preRelease)', t => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataMixed))

  // Expectations
  t.is(version.get(), preReleaseSampleDataMixed.version)
})

test('preRelease (should remove when updating Major)', t => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataNumeric))

  // Actions
  version.newMajor()

  // Expectations
  t.is(version.get(), '1.0.0')
})

test('preRelease (should remove when updating minor)', t => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataNumeric))

  // Actions
  version.newMinor()

  // Expectations
  t.is(version.get(), '1.0.0')
})

test('preRelease (should remove when updating patch)', t => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataNumeric))

  // Actions
  version.newPatch()

  // Expectations
  t.is(version.get(), '1.0.0')
})

test('preRelease (increment)', t => {
  // Setup
  const version = new Version(Object.assign({}, preReleaseSampleDataAlphaNumeric))

  // Actions
  version.prerelease('alpha')

  // Expectations
  t.is(version.get(), '1.0.0-alpha.2')
})

test('preRelease (increment not set)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.prerelease('beta')

  // Expectations
  t.is(version.get(), '0.0.2-beta.0')
})

test('preRelease (set)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Actions
  version.prerelease('beta', 9)

  // Expectations
  t.is(version.get(), '0.0.1-beta.9')
})

test('preRelease (missing argument)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  t.throws(() => {
    version.prerelease()
  })
})
