# update-pkg-extended

> Update package.json with ease - Now with isomorphic support! 🌐

[![license](https://img.shields.io/npm/l/update-pkg-extended)](LICENSE) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Build](https://github.com/panz3r/update-pkg-extended/workflows/Build/badge.svg)](https://github.com/panz3r/update-pkg-extended/actions?query=workflow%3ABuild)
[![Github Issues](https://img.shields.io/github/issues/panz3r/update-pkg-extended.svg)](https://github.com/panz3r/update-pkg-extended/issues)

[![NPM version](https://img.shields.io/npm/v/update-pkg-extended.svg)](https://npmjs.com/package/update-pkg-extended) [![NPM downloads](https://img.shields.io/npm/dm/update-pkg-extended.svg)](https://npmjs.com/package/update-pkg-extended)

A Node.js ES module library for programmatically reading, modifying, and writing package.json files with advanced version management capabilities.

**✨ Now with isomorphic support!** Use in browsers, serverless environments, or any JavaScript runtime without filesystem dependencies.

## Features

- 🌐 **Isomorphic**: Works in browsers, Node.js, serverless, and any JavaScript environment
- 📁 **Filesystem Support**: Optional Node.js filesystem operations for traditional workflows  
- 🎯 **Version Management**: Advanced semantic version manipulation with prerelease support
- 🔗 **Method Chaining**: Fluent API for streamlined package.json manipulation
- 🔧 **Dot Notation**: Deep property access using dot notation (e.g., `author.name`)
- 📦 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🧪 **100% Test Coverage**: Thoroughly tested with comprehensive test suite

## Install

```bash
npm install --save update-pkg-extended
```

or

```bash
yarn add update-pkg-extended
```

or

```bash
pnpm add update-pkg-extended
```

**Note:** This package is an ES module and requires Node.js 18 or higher.

## Usage

### Isomorphic Core (Works Everywhere)

Use the isomorphic core to manipulate package.json data without filesystem dependencies:

```js
import { Pkg } from 'update-pkg-extended/core'

// Create from existing package.json data
const packageData = {
  name: 'my-package',
  version: '1.0.0',
  description: 'A sample package'
}

const pkg = new Pkg(packageData)

// Manipulate the data
pkg.set('author.name', 'John Doe')
pkg.version.newMinor() // 1.1.0
pkg.append('keywords', 'awesome')

// Get the updated JSON
const updatedJson = pkg.stringify()
console.log(updatedJson)
```

### Node.js with Filesystem (Traditional)

For Node.js environments with filesystem access:

```js
import Pkg from 'update-pkg-extended'

// Traditional usage - reads from filesystem
const pkg = new Pkg()

// Update package.json fields
pkg.set('author.name', 'panz3r')
pkg.version.newMinor()

// Save to filesystem
pkg.saveSync()
// or async
await pkg.save()
```

### Hybrid Approach

Combine isomorphic data manipulation with filesystem operations:

```js
import Pkg from 'update-pkg-extended'

// Start with provided data instead of reading from filesystem
const pkg = new Pkg('.', { 
  data: { name: 'my-app', version: '1.0.0' },
  create: true 
})

// Manipulate the data
pkg.set('description', 'My awesome app')
pkg.version.newPatch()

// Save to filesystem when ready
await pkg.save()
```

### Browser/Serverless Usage

In environments without filesystem access:

```js
import { Pkg } from 'update-pkg-extended/core'

// Fetch package.json from API or other source
const response = await fetch('/api/package-json')
const packageData = await response.json()

// Manipulate the data
const pkg = new Pkg(packageData)
pkg.set('version', '2.0.0')
pkg.set('scripts.build', 'webpack --mode=production')

// Send updated data back to API
const updatedData = pkg.data
await fetch('/api/package-json', {
  method: 'PUT',
  body: JSON.stringify(updatedData),
  headers: { 'Content-Type': 'application/json' }
})
```

### ES Modules (Legacy Documentation)

```js
import Pkg from 'update-pkg-extended'

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

### CommonJS

```js
const Pkg = require('update-pkg-extended').default

const pkg = new Pkg()
// ... rest of the usage is the same
```

## API

### Entry Points

- **`update-pkg-extended`** - Main entry point, exports Node.js version for backward compatibility
- **`update-pkg-extended/core`** - Isomorphic core, works in any JavaScript environment
- **`update-pkg-extended/node`** - Explicit Node.js version with filesystem operations

### new Pkg([data, options])

**(From `update-pkg-extended/core`)**

Create a new isomorphic Pkg instance for manipulating package.json data.

#### data

Type: `object`<br>
Optional package.json data object.

#### options

Type: `object`

##### data

Type: `object`<br>
Alternative way to provide package.json data: `new Pkg({ data: packageJson })`

### new Pkg([cwd, options])

Create a new Node.js Pkg instance with filesystem support.

#### cwd

Type: `string`<br>
Default: `'./'`

Directory where a `package.json` can be found or will be created.

#### options

##### create

Type: `boolean`<br>
Default: `false`

Create `package.json` when it does not exist.

##### data

Type: `object`<br>
Provide package.json data directly instead of reading from filesystem (isomorphic mode).

### .data

Type: `object`<br>
Default: `{}`

The package.json data object.

### .set(keyPath, value)

Set value by the given `keyPath` using dot notation.

```js
pkg.set('author.name', 'panz3r')
pkg.set('scripts.test', 'node --test')
```

### .get(keyPath [,defaultValue])

Get value by the given keyPath. Returns `defaultValue` if keyPath is not found.

```js
pkg.get('author.name') // => 'panz3r'
pkg.get('nonexistent', 'default') // => 'default'
```

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

Specify required version `segment`, should be one of `major`, `minor`, `patch`, `prerelease` or `prelease` (backward compatibility)

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

### .stringify([space])

**(Available in both isomorphic and Node.js versions)**

Type: `function`<br>
Return: `string`

Get the package.json content as a formatted JSON string.

#### space

Type: `number`<br>
Default: `2`

Number of spaces for indentation.

```js
import { Pkg } from 'update-pkg-extended/core'

const pkg = new Pkg({ name: 'test', version: '1.0.0' })
const jsonString = pkg.stringify()
// Returns formatted JSON string with newline at end
```

## Migration Guide

### From v5.x to v6.x (Isomorphic Update)

The v6.x release introduces isomorphic support while maintaining full backward compatibility.

#### Existing Code (Still Works!)

```js
// This continues to work exactly as before
import Pkg from 'update-pkg-extended'

const pkg = new Pkg()
pkg.set('version', '2.0.0')
pkg.saveSync()
```

#### New Isomorphic Usage

```js
// For environments without filesystem access
import { Pkg } from 'update-pkg-extended/core'

const pkg = new Pkg({ name: 'my-app', version: '1.0.0' })
pkg.set('description', 'My awesome app')
const updatedJson = pkg.stringify()
```

#### Hybrid Usage

```js
// Combine provided data with filesystem operations
import Pkg from 'update-pkg-extended'

const pkg = new Pkg('.', { 
  data: { name: 'my-app', version: '1.0.0' },
  create: true 
})
pkg.set('description', 'Updated')
await pkg.save()
```

### Breaking Changes

**None!** This release is fully backward compatible.

### New Features

- ✨ **Isomorphic Core**: Import from `update-pkg-extended/core` for browser/serverless usage
- 🔧 **Data Option**: Pass package.json data directly via the `data` option
- 📦 **New Entry Points**: Access specific functionality via `/core` and `/node` sub-imports
- 🎯 **stringify() Method**: Convert package data to formatted JSON string

## Environment Support

| Environment | Entry Point | Filesystem | Notes |
|-------------|-------------|------------|-------|
| **Node.js** | `update-pkg-extended` | ✅ | Full traditional support |
| **Browser** | `update-pkg-extended/core` | ❌ | Isomorphic core only |
| **Serverless** | `update-pkg-extended/core` | ❌ | Perfect for edge functions |
| **Deno/Bun** | `update-pkg-extended/core` | ❌ | Use isomorphic core |
| **Web Workers** | `update-pkg-extended/core` | ❌ | Manipulate data only |

## TypeScript Support

This project is **written in TypeScript** and features comprehensive [TypeScript](https://www.typescriptlang.org/) support with full type definitions.

### Type Definitions

The library exports the following main types:

- `Pkg` - Available from both core and node entry points (isomorphic or Node.js functionality)  
- `PkgCore` - Isomorphic core class (also exported as `Pkg` from core entry)
- `Version` - Version manipulation class
- `PkgCoreOptions` - Options for creating a core Pkg instance
- `PkgOptions` - Options for creating a Node.js Pkg instance (extends PkgCoreOptions)
- `PackageData` - Type definition for package.json structure
- `VersionSegment` - Type for version segments (`'major' | 'minor' | 'patch' | 'prerelease' | 'prelease'`)

### TypeScript Usage

```typescript
import Pkg, { PkgOptions, VersionSegment } from 'update-pkg-extended'
import { Pkg as CorePkg } from 'update-pkg-extended/core'

// Node.js usage with filesystem
const nodeOptions: PkgOptions = { create: true, data: { name: 'test' } }
const nodePkg = new Pkg('./my-project', nodeOptions)

// Isomorphic usage
const corePkg = new CorePkg({ name: 'isomorphic-pkg', version: '1.0.0' })

// Type-safe version segment access
const segment: VersionSegment = 'major'
const majorVersion = corePkg.version.get(segment)

// Type-safe property setting
corePkg.set('author.name', 'TypeScript Developer')
corePkg.set('engines.node', '>=18')

// Get formatted output
const jsonString: string = corePkg.stringify()
```

## Development

This project uses TypeScript and requires a build step:

### Building

```bash
# Install dependencies
pnpm install

# Build TypeScript to JavaScript
pnpm run build

# Run tests
pnpm test

# Run tests with coverage
pnpm run coverage
```

### Scripts

- `pnpm run build` - Compile TypeScript to JavaScript in `dist/` folder
- `pnpm run clean` - Remove compiled `dist/` folder
- `pnpm test` - Build and run all tests
- `pnpm run coverage` - Run tests with 100% coverage requirement

## Credits

- Original codebase credits goes to [EGOIST](https://github.com/egoist)'s [update-pkg](https://github.com/egoist/update-pkg)
- `Version` feature is inspired by [ciena-blueplanet](https://github.com/ciena-blueplanet)'s [versiony](https://github.com/ciena-blueplanet/versiony)

---

Made with :sparkles: & :heart: by [Mattia Panzeri](https://github.com/panz3r) and [contributors](https://github.com/panz3r/update-pkg-extended/graphs/contributors)
