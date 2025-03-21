# update-pkg-extended

> Update package.json with ease

[![license](https://img.shields.io/npm/l/update-pkg-extended)](LICENSE) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Build](https://github.com/panz3r/update-pkg-extended/workflows/Build/badge.svg)](https://github.com/panz3r/update-pkg-extended/actions?query=workflow%3ABuild)
[![Github Issues](https://img.shields.io/github/issues/panz3r/update-pkg-extended.svg)](https://github.com/panz3r/update-pkg-extended/issues)

[![NPM version](https://img.shields.io/npm/v/update-pkg-extended.svg)](https://npmjs.com/package/update-pkg-extended) [![NPM downloads](https://img.shields.io/npm/dm/update-pkg-extended.svg)](https://npmjs.com/package/update-pkg-extended)

## Install

```bash
npm install --save update-pkg-extended
```

or

```bash
yarn add update-pkg-extended
```

## Usage

```js
const Pkg = require('update-pkg-extended')

const pkg = new Pkg()
pkg.data //=> package.json object

// Update package.json fields
pkg.set('author.name', 'panz3r')

// Get version
pkg.version.get() // => '0.0.9'

// Update minor version
pkg.version.newMinor() // => '0.1.0'

// Save synchronously
pkg.saveSync()
// or using Promise
pkg.save().then(/* ... */)
```

## API

### new Pkg([cwd, options])

Return a new Pkg instance representing `package.json` located at `cwd` folder.

#### cwd

Type: `string`<br>
Default: `'./'`

Directory where a `package.json` can be found. Defaults to current directory.

#### options

##### create

Type: `boolean`<br>
Default: `false`

Create `package.json` when it does not exist.

### .data

Type: `object`<br>
Default: `{}`

The parsed content of `package.json`.

### .set(keyPath, value)

Set value by the given `keyPath` like `author.name` and `value` like `panz3r`.

### .get(keyPath [,defaultValue])

Get value by the given keyPath.<br>
If `keyPath` is not found and `defaultValue` is specified, `defaultValue` will be returned, otherwise will return `undefined`

### .update(keyPath, updateFn)

Update `keyPath` value using `updateFn` function.<br>
`updateFn` is invoked with the current `keyPath` value.

### .append(keyPath, value)

Append `value` to the given `keyPath`.

### .prepend(keyPath, value)

Prepend `value` to the given `keyPath`.

### .version

Type: `Version`

Manage version field in a `semver`-compatible way

##### .get([segment])

Return formatted version (`0.0.3`) if `segment` is not specified, otherwise returns the required `segment`

###### segment

Type: `string`<br>
Default: `undefined`

Specify required version `segment`, should be one of `major`, `minor`, `patch` or `prerelease`

##### .newMajor()

Increment `major` version and reset all others fields

```js
pkg.version.get() // => '0.0.3'

// New major version
pkg.version.newMajor() // => '1.0.0'
```

##### .newMinor()

Increment `minor` version and reset patch field

```js
pkg.version.get() // => '0.0.3'

// New minor version
pkg.version.newMinor() // => '0.1.0'
```

##### .major([major])

Increment or set `major`

```js
pkg.version.get() // => '0.0.3'

// Increment major version
pkg.version.major() // => '1.0.3'

// Set major version to specified value
pkg.version.major(3) // => '3.0.3'
```

##### .minor([minor])

Increment or set `minor` version

```js
pkg.version.get() // => '0.0.3'

// Increment minor version
pkg.version.minor() // => '0.1.3'

// Set minor version to specified value
pkg.version.minor(3) // => '0.3.3'
```

##### .patch([patch])

Increment or set `patch` version

```js
pkg.version.get() // => '0.0.3'

// Increment minor version
pkg.version.patch() // => '0.0.4'

// Set minor version to specified value
pkg.version.patch(9) // => '0.0.9'
```

##### .prerelease(prereleaseIdentifier, [prereleaseVersion])

Increment or set `prerelease` version

```js
pkg.version.get() // => '0.0.3'

// Set prerelease version to specified value
pkg.version.prerelease('beta', 9) // => '0.0.3-beta.9'

// Increment prerelease version
pkg.version.prerelease('beta') // => '0.0.4-beta.0'

// Increment prerelease version
pkg.version.prerelease('beta') // => '0.0.4-beta.1'
```

**N.B:** Bumping `prerelease` version when it is not set will also bump `patch` version


### .save()

Type: `function`<br>
Return: `Promise`

Save data to `package.json`.

### .saveSync()

Type: `function`<br>
Return: `this`

Save data to `package.json` synchronously.

## Credits

- Original codebase credits goes to [EGOIST](https://github.com/egoist)'s [update-pkg](https://github.com/egoist/update-pkg)
- `Version` feature is inspired by [ciena-blueplanet](https://github.com/ciena-blueplanet)'s [versiony](https://github.com/ciena-blueplanet/versiony)

---

Made with :sparkles: & :heart: by [Mattia Panzeri](https://github.com/panz3r) and [contributors](https://github.com/panz3r/update-pkg-extended/graphs/contributors)
