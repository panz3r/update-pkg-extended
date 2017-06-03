# update-pkg-extended [![NPM version](https://img.shields.io/npm/v/update-pkg-extended.svg)](https://npmjs.com/package/update-pkg-extended)

[![license](https://img.shields.io/github/license/panz3r/update-pkg-extended.svg)](LICENSE)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Travis](https://img.shields.io/travis/panz3r/update-pkg-extended.svg)](http://travis-ci.org/panz3r/update-pkg-extended) 
[![Coverage Status](https://coveralls.io/repos/github/panz3r/update-pkg-extended/badge.svg?branch=master)](https://coveralls.io/github/panz3r/update-pkg-extended?branch=master)
[![NPM downloads](https://img.shields.io/npm/dm/update-pkg-extended.svg)](https://npmjs.com/package/update-pkg-extended)

> Update package.json with ease

## Install

```bash
$ npm install --save update-pkg-extended
```
or
```bash
$ yarn add update-pkg-extended
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

### .version

Type: `Version`

Manage version field in a `semver`-compatible way

##### .get()

Return formatted version (`0.0.3`)

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


### .save([indent])

Type: `function`<br>
Return: `Promise`

Save data to `package.json`.
Default `indent` is `4`

### .saveSync([indent])

Type: `function`<br>
Return: `this`

Save data to `package.json` but synchronously.
Default `indent` is `4`

## Credits
- Original codebase credits goes to [EGOIST](https://github.com/egoist)'s [update-pkg](https://github.com/egoist/update-pkg)
- `Version` feature is inspired by [ciena-blueplanet](https://github.com/ciena-blueplanet)'s [versiony](https://github.com/ciena-blueplanet/versiony)

## License

MIT © [panz3r](https://github.com/panz3r)
