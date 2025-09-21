/**
 * Internal implementation of package.json reading and writing functionality
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Read and parse package.json synchronously
 * @param {object} options - Options object
 * @param {string} options.cwd - Directory to look for package.json
 * @returns {object} Parsed package.json content
 */
export function readPackageSync({ cwd = './' } = {}) {
  const packagePath = resolve(cwd, 'package.json')
  
  if (!existsSync(packagePath)) {
    const error = new Error(`ENOENT: no such file or directory, open '${packagePath}'`)
    error.code = 'ENOENT'
    error.errno = -2
    error.syscall = 'open'
    error.path = packagePath
    throw error
  }
  
  const content = readFileSync(packagePath, 'utf8')
  return JSON.parse(content)
}

/**
 * Read and parse package.json asynchronously
 * @param {object} options - Options object
 * @param {string} options.cwd - Directory to look for package.json
 * @returns {Promise<object>} Parsed package.json content
 */
export async function readPackage({ cwd = './' } = {}) {
  const { readFile } = await import('fs/promises')
  const packagePath = resolve(cwd, 'package.json')
  
  try {
    const content = await readFile(packagePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') {
      const newError = new Error(`ENOENT: no such file or directory, open '${packagePath}'`)
      newError.code = 'ENOENT'
      newError.errno = -2
      newError.syscall = 'open'
      newError.path = packagePath
      throw newError
    }
    throw error
  }
}

/**
 * Write package.json synchronously
 * @param {string} cwd - Directory to write package.json to
 * @param {object} data - Package data to write
 * @returns {void}
 */
export function writePackageSync(cwd, data) {
  const packagePath = resolve(cwd, 'package.json')
  const content = JSON.stringify(data, null, 2) + '\n'
  writeFileSync(packagePath, content, 'utf8')
}

/**
 * Write package.json asynchronously
 * @param {string} cwd - Directory to write package.json to
 * @param {object} data - Package data to write
 * @returns {Promise<void>}
 */
export async function writePackage(cwd, data) {
  const { writeFile } = await import('fs/promises')
  const packagePath = resolve(cwd, 'package.json')
  const content = JSON.stringify(data, null, 2) + '\n'
  await writeFile(packagePath, content, 'utf8')
}