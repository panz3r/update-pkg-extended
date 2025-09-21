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
 * Safely navigate to a property in an object
 * @param {object} object - The target object
 * @param {string[]} keys - Array of property keys
 * @param {boolean} createPath - Whether to create missing intermediate objects
 * @returns {object|null} The target object/property or null if not found
 */
function safeNavigate(object, keys, createPath = false) {
  let current = object
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    
    if (!isSafeKey(key)) {
      return null
    }
    
    if (current == null || typeof current !== 'object') {
      return null
    }
    
    if (!(key in current)) {
      if (createPath) {
        current[key] = {}
      } else {
        return null
      }
    }
    
    current = current[key]
  }
  
  return current
}

/**
 * Split a path string into an array of keys
 * @param {string} path - The property path
 * @returns {string[]} Array of keys
 */
function splitPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }
  
  if (path === '') {
    return []
  }
  
  // Handle simple cases without dots or brackets
  if (!path.includes('.') && !path.includes('[')) {
    return [path]
  }
  
  const keys = []
  let current = ''
  let inBrackets = false
  
  for (let i = 0; i < path.length; i++) {
    const char = path[i]
    
    if (char === '[') {
      if (current) {
        keys.push(current)
        current = ''
      }
      inBrackets = true
    } else if (char === ']') {
      if (inBrackets && current) {
        keys.push(current)
        current = ''
      }
      inBrackets = false
    } else if (char === '.' && !inBrackets) {
      if (current) {
        keys.push(current)
        current = ''
      }
    } else {
      current += char
    }
  }
  
  if (current) {
    keys.push(current)
  }
  
  return keys
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
  const result = safeNavigate(object, keys)
  
  return result !== null ? result : defaultValue
}

/**
 * Set a property value in an object using dot notation
 * @param {object} object - The target object
 * @param {string} path - The property path
 * @param {*} value - The value to set
 * @returns {void}
 */
export function setProperty(object, path, value) {
  if (!object || typeof object !== 'object') {
    throw new TypeError('Object must be an object')
  }
  
  const keys = splitPath(path)
  if (keys.length === 0) {
    throw new Error('Cannot set root object')
  }
  
  const lastKey = keys[keys.length - 1]
  if (!isSafeKey(lastKey)) {
    throw new Error('Cannot set unsafe property')
  }
  
  if (keys.length === 1) {
    object[lastKey] = value
    return
  }
  
  // Navigate to parent, creating intermediate objects as needed
  let current = object
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    
    if (!isSafeKey(key)) {
      throw new Error('Cannot navigate through unsafe property')
    }
    
    if (!(key in current) || current[key] == null || typeof current[key] !== 'object') {
      current[key] = {}
    }
    
    current = current[key]
  }
  
  current[lastKey] = value
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
  
  // Check if any key in the path is unsafe
  if (keys.some(key => !isSafeKey(key))) {
    return false
  }
  
  const result = safeNavigate(object, keys)
  return result !== null
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
  if (keys.length === 0) {
    return false
  }
  
  const lastKey = keys[keys.length - 1]
  if (!isSafeKey(lastKey)) {
    return false
  }
  
  if (keys.length === 1) {
    if (lastKey in object) {
      delete object[lastKey]
      return true
    }
    return false
  }
  
  const parentKeys = keys.slice(0, -1)
  const parent = safeNavigate(object, parentKeys)
  
  if (parent !== null && lastKey in parent) {
    delete parent[lastKey]
    return true
  }
  
  return false
}