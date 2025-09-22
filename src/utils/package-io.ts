/**
 * Internal implementation of package.json reading and writing functionality
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Options for reading package.json
 */
interface ReadPackageOptions {
  cwd?: string
}

/**
 * Read and parse package.json synchronously
 * @param options - Options object
 * @returns Parsed package.json content
 */
export function readPackageSync({ cwd = './' }: ReadPackageOptions = {}): Record<string, any> {
  const packagePath = resolve(cwd, 'package.json')
  
  if (!existsSync(packagePath)) {
    const error = new Error(`ENOENT: no such file or directory, open '${packagePath}'`) as NodeJS.ErrnoException
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
 * @param options - Options object
 * @returns Parsed package.json content
 */
export async function readPackage({ cwd = './' }: ReadPackageOptions = {}): Promise<Record<string, any>> {
  const { readFile } = await import('fs/promises')
  const packagePath = resolve(cwd, 'package.json')
  
  try {
    const content = await readFile(packagePath, 'utf8')
    return JSON.parse(content)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const newError = new Error(`ENOENT: no such file or directory, open '${packagePath}'`) as NodeJS.ErrnoException
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
 * @param cwd - Directory to write package.json to
 * @param data - Package data to write
 */
export function writePackageSync(cwd: string, data: Record<string, any>): void {
  const packagePath = resolve(cwd, 'package.json')
  const content = JSON.stringify(data, null, 2) + '\n'
  writeFileSync(packagePath, content, 'utf8')
}

/**
 * Write package.json asynchronously
 * @param cwd - Directory to write package.json to
 * @param data - Package data to write
 */
export async function writePackage(cwd: string, data: Record<string, any>): Promise<void> {
  const { writeFile } = await import('fs/promises')
  const packagePath = resolve(cwd, 'package.json')
  const content = JSON.stringify(data, null, 2) + '\n'
  await writeFile(packagePath, content, 'utf8')
}