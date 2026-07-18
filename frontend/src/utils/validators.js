/* ClearView — Input validators */

/**
 * Validate that a value is a positive integer (for IDs).
 * @param {string|number} value
 * @returns {{ valid: boolean, message: string }}
 */
export function validateId(value) {
  const num = Number(value);
  if (!value && value !== 0) {
    return { valid: false, message: 'Please enter an ID' };
  }
  if (!Number.isInteger(num) || num <= 0) {
    return { valid: false, message: 'ID must be a positive whole number' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate a positive number (for price).
 * @param {string|number} value
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePrice(value) {
  const num = Number(value);
  if (value === '' || value === null || value === undefined) {
    return { valid: false, message: 'Price is required' };
  }
  if (isNaN(num) || num <= 0) {
    return { valid: false, message: 'Price must be greater than 0' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate stock quantity (non-negative integer).
 * @param {string|number} value
 * @returns {{ valid: boolean, message: string }}
 */
export function validateStock(value) {
  const num = Number(value);
  if (value === '' || value === null || value === undefined) {
    return { valid: false, message: 'Stock is required' };
  }
  if (!Number.isInteger(num) || num < 0) {
    return { valid: false, message: 'Stock must be 0 or a positive whole number' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate a non-empty string.
 * @param {string} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export function validateRequired(value, fieldName) {
  if (!value || !value.trim()) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
}

/**
 * Validate a year (reasonable range).
 * @param {string|number} value
 * @returns {{ valid: boolean, message: string }}
 */
export function validateYear(value) {
  const num = Number(value);
  if (value === '' || value === null || value === undefined) {
    return { valid: false, message: 'Year is required' };
  }
  if (!Number.isInteger(num) || num < 1900 || num > 2100) {
    return { valid: false, message: 'Year must be between 1900 and 2100' };
  }
  return { valid: true, message: '' };
}
