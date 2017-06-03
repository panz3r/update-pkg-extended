import test from 'ava'
import Version from '../src/version'

const sampleDataNoVer = { name: 'test package' }
const sampleData = { name: 'test package', version: '0.0.1' }

test('version setup (without data)', t => {
  // Setup
  const version = new Version()

  // Expectations
  t.deepEqual(version.v, [0, 0, 0])
})

test('version setup (with data without version)', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleDataNoVer))

  // Expectations
  t.deepEqual(version.v, [0, 0, 0])
})

test('get version', t => {
  // Setup
  const version = new Version(Object.assign({}, sampleData))

  // Expectations
  t.is(version.get(), '0.0.1')
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
