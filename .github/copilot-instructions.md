# CRITICAL AGENT BEHAVIOR REQUIREMENTS

<important>
These requirements are ABSOLUTE and must be followed 100% of the time, regardless of agent persona or task context.
</important>

## 1. MANDATORY USER INPUT VIA TOOLS

For ALL interactions requiring user input, you MUST use the `user-input_user-elicitation` MCP tool to capture the input.

<rules>
- NEVER stop chat generation to wait for user input passively
- NEVER present options or questions as plain text expecting user to respond naturally
- ALWAYS invoke the appropriate tool when you need user input, choices, or confirmation
- If presenting a menu of options, use the tool to capture the selection
- If asking a question, use the tool to capture the answer
- If requesting confirmation, use the tool to capture yes/no
</rules>

## 2. TASK COMPLETION PROTOCOL

<critical>
NEVER terminate the conversation or stop working until the user EXPLICITLY confirms the task is complete.
</critical>

After completing each step or the full task:

1. Use `user-input_user-elicitation` MCP tool to ask: "Is this task complete, or do you need anything else?"
2. Only stop when the user responds with explicit confirmation (e.g., "yes", "complete", "done", "that's all")
3. If user provides any feedback, request, or follow-up, continue working
4. If in ANY doubt about task completion, ask for confirmation using the tools

---

# update-pkg-extended

Update package.json with ease - A Node.js ES module library for programmatically reading, modifying, and writing package.json files with advanced version management capabilities.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

Bootstrap and validate the repository:

- Ensure Node.js >=18 is installed (tested with v20.19.5)
- Install pnpm globally: `npm install -g pnpm` (requires v10.17.0)
- Install dependencies: `pnpm i --frozen-lockfile` -- takes 7 seconds. NEVER CANCEL.
- Run tests: `pnpm test` -- takes 1 second for comprehensive test suite with 100% coverage. NEVER CANCEL.
- Run linting: `pnpx standard --verbose "src/**/*.js" "test/**/*.js"` -- takes 16 seconds. NEVER CANCEL.
- Run coverage check: `pnpm run coverage` -- takes 2 seconds, enforces 100% line coverage via Node.js test runner. NEVER CANCEL.

## Validation

Always manually validate your changes by creating a test scenario:

- Create a temporary directory: `mkdir -p /tmp/test-pkg && cd /tmp/test-pkg`
- Test core functionality with a validation script:

```javascript
import Pkg from "/home/runner/work/update-pkg-extended/update-pkg-extended/src/index.js";

// Test basic package creation and manipulation
const pkg = new Pkg(".", { create: true });
pkg.set("name", "test-package");
pkg.version.major(1); // Set major version to 1
pkg.version.minor(0); // Set minor version to 0
pkg.version.patch(0); // Set patch version to 0
console.log("After setting version to 1.0.0:", pkg.version.get());

pkg.set("scripts.test", "node --test");
pkg.version.newMinor(); // Should increment to 1.1.0
console.log("After newMinor:", pkg.version.get());

pkg.saveSync();

console.log("Final package version:", pkg.version.get());
// Verify the package.json file: cat package.json
```

- Always verify the generated package.json file contains expected changes
- Test version operations: major, minor, patch, and prerelease versions
- Test property manipulation: get, set, append, prepend, delete operations

## Build and Testing

This is a pure ES module library with no build step required.

- **Dependencies**: pnpm v10.17.0 package manager with frozen lockfile
- **Tests**: Node.js built-in test runner (node:test) with comprehensive test suite achieving 100% code coverage
- **Linting**: StandardJS linting enforced in CI
- **Coverage**: Node.js test runner coverage enforcing 100% line coverage
- **CI/CD**: GitHub Actions with matrix testing across Node.js versions and OS platforms

Test commands with accurate timing:

- `pnpm test` -- 1 second, runs full test suite with Node.js test runner
- `pnpm run coverage` -- 2 seconds, runs tests with coverage enforcement
- `pnpx standard --verbose "src/**/*.js" "test/**/*.js"` -- 16 seconds, lints all source files

NEVER CANCEL any command. All operations complete quickly (under 20 seconds).

Always run the linter before committing changes or the CI will fail.

## Core Functionality

This library provides:

- **Package.json manipulation**: Read, create, modify package.json files
- **Version management**: Semantic version operations (major, minor, patch, prerelease)
- **Property operations**: Get/set nested properties using dot notation
- **Array operations**: Append/prepend to array properties
- **TypeScript support**: Full TypeScript definitions included

### Key Usage Patterns

1. **Creating new package.json**:

```javascript
const pkg = new Pkg("/path/to/dir", { create: true });
```

2. **Version operations**:

```javascript
pkg.version.get(); // Returns current version
pkg.version.newMajor(); // Increments major, resets minor/patch
pkg.version.newMinor(); // Increments minor, resets patch
pkg.version.newPatch(); // Increments patch
pkg.version.prerelease("beta", 1); // Sets prerelease version
```

3. **Property manipulation**:

```javascript
pkg.set("author.name", "value"); // Set nested property
pkg.get("scripts.test", "default"); // Get with optional default
pkg.append("keywords", "new-keyword"); // Add to array
pkg.del("unwanted.property"); // Delete property
```

## Project Structure

### Key Files and Directories

```
/src/
  index.js       - Main export, imports package.js
  package.js     - Core Pkg class with all package.json operations
  version.js     - Version class handling semantic version operations

/test/
  package.test.js - Tests for Pkg class (constructor, CRUD operations, save)
  version.test.js - Tests for Version class (all version operations)

/index.d.ts      - TypeScript definitions
/package.json    - Project configuration with ES module setup
/.github/workflows/
  build.yml      - CI for pull requests (lint + test matrix)
  release.yml    - Release automation with release-please
```

### Dependencies

- **Runtime**: All functionality is now implemented internally (internal utilities for property manipulation, file I/O, and version parsing)
- **Development**: native Node.js coverage, rimraf (cleanup)
- **Testing**: Node.js built-in test runner (node:test)
- **Package Manager**: pnpm with frozen lockfile for reproducible builds

## Common Tasks

### Running the application

This is a library, not an application. Test functionality by:

1. Import the library: `import Pkg from './src/index.js'`
2. Create instances and test operations as shown in validation examples
3. Check generated files match expectations

### Debugging

- Use Node.js built-in debugging: `node --inspect-brk`
- All operations are synchronous except save() which returns Promise
- Check the `/tmp` directory for test artifacts during validation

### Release Process

- Uses release-please for automated versioning and changelog generation
- Triggered on pushes to main branch
- Publishes to npm registry automatically on release creation

## Validation Scenarios

After making any changes, always:

1. Run full test suite and ensure all tests pass
2. Verify 100% code coverage is maintained
3. Run linting to ensure code style compliance
4. Create a manual test in `/tmp` directory that exercises your changes
5. Verify the generated package.json files match expected output
6. Test both sync and async save operations if modifying save functionality
7. Test error conditions (missing files, invalid options) if modifying error handling

## Common File Outputs

### Repo root contents

```
.devcontainer/          - VS Code dev container configuration
.editorconfig           - Editor formatting rules
.github/                - GitHub workflows and configuration
.gitignore             - Git ignore patterns
.npmignore             - npm publish ignore patterns
CHANGELOG.md           - Release history (auto-generated)
LICENSE                - MIT license
README.md              - Project documentation
_config.yml            - GitHub Pages configuration
index.d.ts             - TypeScript definitions
package.json           - Project configuration
pnpm-lock.yaml         - Dependency lock file
release-please-config.json - Release automation config
src/                   - Source code
test/                  - Test files
```

### Example package.json structure after operations

```json
{
  "name": "example-package",
  "version": "1.2.3-beta.1",
  "scripts": {
    "test": "node --test",
    "build": "tsc"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```
