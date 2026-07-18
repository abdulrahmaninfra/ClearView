/* ClearView — Navbar component */
import { icon } from './icons.js';

const NAV_ITEMS = [
  { path: '/', label: 'Home', iconName: 'layoutDashboard' },
  { path: '/search', label: 'Search', iconName: 'search' },
  { path: '/trade', label: 'Trade', iconName: 'package' },
  { path: '/update', label: 'Update', iconName: 'pencil' },
  { path: '/delete', label: 'Delete', iconName: 'trash2' },
];

export function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  nav.innerHTML = `
    <div class="nav-container">
      <a class="nav-logo" href="#/" aria-label="ClearView Home">
        <span class="nav-logo-icon">◆</span>
        <span class="nav-logo-text">ClearView</span>
      </a>
      <div class="nav-links" role="navigation" aria-label="Main navigation">
        ${NAV_ITEMS.map(
          (item) => `
          <a class="nav-link" href="#${item.path}" data-path="${item.path}" aria-label="${item.label}">
            <span class="nav-link-icon">${icon(item.iconName, 18)}</span>
            <span class="nav-link-label">${item.label}</span>
          </a>
        `
        ).join('')}
      </div>
    </div>

    <!-- Mobile bottom nav -->
    <div class="nav-mobile" role="navigation" aria-label="Mobile navigation">
      ${NAV_ITEMS.map(
        (item) => `
        <a class="nav-mobile-link" href="#${item.path}" data-path="${item.path}" aria-label="${item.label}">
          <span class="nav-mobile-icon">${icon(item.iconName, 20)}</span>
          <span class="nav-mobile-label">${item.label}</span>
        </a>
      `
      ).join('')}
    </div>
  `;
}
