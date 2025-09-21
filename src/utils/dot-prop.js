/**
 * Internal implementation of dot-prop functionality
 * Handles property access/manipulation with dot notation support
 */

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
  let current = object
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return defaultValue
    }
    current = current[key]
  }
  
  return current
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
  
  let current = object
  
  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    
    if (!(key in current) || current[key] == null || typeof current[key] !== 'object') {
      current[key] = {}
    }
    
    current = current[key]
  }
  
  // Set the final property
  const lastKey = keys[keys.length - 1]
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
  let current = object
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object' || !(key in current)) {
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
  if (keys.length === 0) {
    return false
  }
  
  let current = object
  
  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return false
    }
    
    current = current[key]
  }
  
  // Delete the final property
  const lastKey = keys[keys.length - 1]
  if (lastKey in current) {
    delete current[lastKey]
    return true
  }
  
  return false
}