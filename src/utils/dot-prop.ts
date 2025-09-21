/**
 * Internal implementation of dot-prop functionality
 * Handles property access/manipulation with dot notation support
 */

/**
 * Check if a key is safe to use (prevents prototype pollution)
 * @param key - The property key to check
 * @returns True if the key is safe
 */
function isSafeKey(key: string): boolean {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype'
}

/**
 * Split a path string into an array of keys
 * @param path - The property path
 * @returns Array of keys
 */
function splitPath(path: string): string[] {
  return path.split('.')
}

/**
 * Get a property value from an object using dot notation
 * @param object - The target object
 * @param path - The property path
 * @param defaultValue - Default value if property doesn't exist
 * @returns The property value
 */
export function getProperty(object: unknown, path: string, defaultValue?: unknown): unknown {
  if (!object || typeof object !== 'object') {
    return defaultValue
  }
  
  const keys = splitPath(path)
  let current: any = object
  
  for (const key of keys) {
    if (!isSafeKey(key) || current == null || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, key)) {
      return defaultValue
    }
    current = current[key]
  }
  
  return current
}

/**
 * Set a property value in an object using dot notation
 * @param object - The target object
 * @param path - The property path
 * @param value - The value to set
 */
export function setProperty(object: Record<string, any>, path: string, value: unknown): void {
  const keys = splitPath(path)
  
  if (keys.length === 1) {
    const key = keys[0]
    if (isSafeKey(key)) {
      object[key] = value
    }
    return
  }
  
  let current: any = object
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    
    if (!isSafeKey(key)) {
      return
    }
    
    if (!Object.prototype.hasOwnProperty.call(current, key) || current[key] == null || typeof current[key] !== 'object') {
      current[key] = {}
    }
    
    current = current[key]
  }
  
  const lastKey = keys[keys.length - 1]
  if (isSafeKey(lastKey)) {
    current[lastKey] = value
  }
}

/**
 * Check if a property exists in an object using dot notation
 * @param object - The target object
 * @param path - The property path
 * @returns True if property exists
 */
export function hasProperty(object: unknown, path: string): boolean {
  if (!object || typeof object !== 'object') {
    return false
  }
  
  const keys = splitPath(path)
  let current: any = object
  
  for (const key of keys) {
    if (!isSafeKey(key) || current == null || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, key)) {
      return false
    }
    current = current[key]
  }
  
  return true
}

/**
 * Delete a property from an object using dot notation
 * @param object - The target object
 * @param path - The property path
 * @returns True if property was deleted
 */
export function deleteProperty(object: unknown, path: string): boolean {
  if (!object || typeof object !== 'object') {
    return false
  }
  
  const keys = splitPath(path)
  
  if (keys.length === 1) {
    const key = keys[0]
    if (isSafeKey(key) && Object.prototype.hasOwnProperty.call(object as any, key)) {
      delete (object as any)[key]
      return true
    }
    return false
  }
  
  let current: any = object
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    
    if (!isSafeKey(key) || current == null || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, key)) {
      return false
    }
    
    current = current[key]
  }
  
  const lastKey = keys[keys.length - 1]
  if (isSafeKey(lastKey) && Object.prototype.hasOwnProperty.call(current, lastKey)) {
    delete current[lastKey]
    return true
  }
  
  return false
}