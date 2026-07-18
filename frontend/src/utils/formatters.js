/* ClearView — Utility functions: formatting */

/**
 * Format a number as USD currency.
 * @param {number} value
 * @returns {string} e.g. "$1,275.50"
 */
export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a large number with commas.
 * @param {number} value
 * @returns {string} e.g. "14,230"
 */
export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Get stock status based on quantity.
 * @param {number} stock
 * @returns {{ level: string, label: string, dotClass: string, badgeClass: string }}
 */
export function getStockStatus(stock) {
  if (stock >= 5) {
    return { level: 'high', label: 'In Stock', dotClass: 'stock-dot--high', badgeClass: 'badge--green' };
  }
  if (stock >= 1) {
    return { level: 'medium', label: 'Low Stock', dotClass: 'stock-dot--medium', badgeClass: 'badge--yellow' };
  }
  return { level: 'low', label: 'Out of Stock', dotClass: 'stock-dot--low', badgeClass: 'badge--red' };
}

/**
 * Compute stock bar percentage for visual display (max cap at 50 units).
 * @param {number} stock
 * @returns {number} percentage 0–100
 */
export function stockPercentage(stock) {
  return Math.min(100, Math.round((stock / 50) * 100));
}
