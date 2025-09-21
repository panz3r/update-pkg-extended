/**
 * Internal implementation of dot-prop functionality
 * Handles property access/manipulation with dot notation support
 */

/**
 * Check if a key is safe to use (prevents prototype pollution)
 * @param {string} key - The property key to check
 * @returns {boolean} True if the key is safe
 */
function isSafeKey(key) {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype'
}

/**
 * Split a path string into an array of keys
 * @param {string} path - The property path
 * @returns {string[]} Array of keys
 */
function splitPath(path) {
  return path.split('.')
}

/**
 * Get a property value from an object using dot notation
 * @param {object} object - The target object
 * @param {string} path - The property path
 * @param {*} defaultValue - Default value if property doesn't exist
 * @returns {*} The property value
 */
export function getProperty(object, path, defaultValue) {
  if (!object || typeof object !== 'object') {
    return defaultValue
  }
  
  const keys = splitPath(path)
  let current = object
  
  for (const key of keys) {
    if (!isSafeKey(key) || current == null || typeof current !== 'object' || !(key in current)) {
      return defaultValue
    }
    current = current[key]
  }
  
  return current
}

/**
 * Set a property value in an object using dot notation
 * @param {object} path - The property path
 * @param {*} value - The value to set
 * @returns {void}
 */
export function setProperty(object, path, value) {
  const keys = splitPath(path)
  
  if (keys.length === 1) {
    const key = keys[0]
    if (isSafeKey(key)) {
      object[key] = value
    }
    return
  }
  
  let current = object
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    
    if (!isSafeKey(key)) {
      return
    }
    
    if (!(key in current) || current[key] == null || typeof current[key] !== 'object') {
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
 * @param {object} object - The target object
 * @param {string} path - The property path
 * @returns {boolean} True if property exists
 */
export function hasProperty(object, path) {
  if (!object || typeof object !== 'object') {
    return false
  }
  
  const keys = splitPath(path)
  let current = object
  
  for (const key of keys) {
    if (!isSafeKey(key) || current == null || typeof current !== 'object' || !(key in current)) {
      return false
    }
    current = current[key]
  }
  
  return true
}

/**
 * Delete a property from an object using dot notation
 * @param {object} object - The target object
 * @param {string} path - The property path
 * @returns {boolean} True if property was deleted
 */
export function deleteProperty(object, path) {
  if (!object || typeof object !== 'object') {
    return false
  }
  
  const keys = splitPath(path)
  
  if (keys.length === 1) {
    const key = keys[0]
    if (isSafeKey(key) && key in object) {
      delete object[key]
      return true
    }
    return false
  }
  
  let current = object
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    
    if (!isSafeKey(key) || current == null || typeof current !== 'object' || !(key in current)) {
      return false
    }
    
    current = current[key]
  }
  
  const lastKey = keys[keys.length - 1]
  if (isSafeKey(lastKey) && lastKey in current) {
    delete current[lastKey]
    return true
  }
  
  return false
}