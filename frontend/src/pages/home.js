import { api } from '../services/api.js';
import { icon } from '../components/icons.js';
import { formatPrice, formatNumber, getStockStatus } from '../utils/formatters.js';
import { navigate } from '../router.js';

export default async function homePage() {
  let html = '';
  let items = [];
  let isLoading = true;
  let error = null;

  try {
    items = await api.getAll();
    isLoading = false;
  } catch (err) {
    error = err.message;
    isLoading = false;
  }

  if (isLoading) {
    return {
      html: `
        <div class="page-header">
          <div class="skeleton skeleton-text" style="width: 300px; height: 40px; margin-bottom: 8px;"></div>
          <div class="skeleton skeleton-text" style="width: 400px; height: 20px;"></div>
        </div>
        <div class="home-stats">
          <div class="skeleton skeleton-stat"></div>
          <div class="skeleton skeleton-stat"></div>
          <div class="skeleton skeleton-stat"></div>
          <div class="skeleton skeleton-stat"></div>
        </div>
      `,
      mount() {}
    };
  }

  if (error) {
    return {
      html: `
        <div class="page-header">
          <h1 class="page-title">ClearView Dashboard</h1>
        </div>
        <div class="empty-state">
          ${icon('triangleAlert', 64)}
          <h3 class="empty-state-title">Failed to load dashboard</h3>
          <p class="empty-state-text">${error}</p>
          <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
        </div>
      `,
      mount() {}
    };
  }

  // Compute stats
  const totalItems = items.reduce((sum, item) => sum + item.stock, 0);
  const activeBrands = new Set(items.map(item => item.brand)).size;
  const lowStockItems = items.filter(item => item.stock < 5).length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.stock), 0);

  // Last 5 items
  const recentItems = [...items].sort((a, b) => b.id - a.id).slice(0, 5);

  html = `
    <div class="page-header">
      <h1 class="page-title">Welcome to ClearView</h1>
      <p class="page-subtitle">Your windshield inventory at a glance.</p>
    </div>

    <div class="home-stats">
      <div class="stat-card">
        <div class="stat-icon stat-icon--primary">${icon('box')}</div>
        <div class="stat-content">
          <span class="stat-label">Total Items</span>
          <span class="stat-value">${formatNumber(totalItems)}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon--accent">${icon('tag')}</div>
        <div class="stat-content">
          <span class="stat-label">Active Brands</span>
          <span class="stat-value">${formatNumber(activeBrands)}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon--warning">${icon('triangleAlert')}</div>
        <div class="stat-content">
          <span class="stat-label">Low Stock</span>
          <span class="stat-value">${formatNumber(lowStockItems)}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon--secondary">${icon('dollarSign')}</div>
        <div class="stat-content">
          <span class="stat-label">Total Value</span>
          <span class="stat-value">${formatPrice(totalValue)}</span>
        </div>
      </div>
    </div>

    <h2 class="section-title">Quick Actions</h2>
    <div class="home-actions">
      <div class="action-card" data-route="/search">
        <div class="action-icon">${icon('search')}</div>
        <div class="action-content">
          <span class="action-title">Search</span>
          <span class="action-subtitle">Find items by ID or brand</span>
        </div>
      </div>
      <div class="action-card" data-route="/trade">
        <div class="action-icon">${icon('package')}</div>
        <div class="action-content">
          <span class="action-title">Trade</span>
          <span class="action-subtitle">Buy and sell stock</span>
        </div>
      </div>
      <div class="action-card" data-route="/update">
        <div class="action-icon">${icon('pencil')}</div>
        <div class="action-content">
          <span class="action-title">Update</span>
          <span class="action-subtitle">Edit item details</span>
        </div>
      </div>
    </div>

    <h2 class="section-title">Recent Inventory</h2>
    <div class="home-table table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          ${recentItems.length > 0 ? recentItems.map(item => {
            const stockStatus = getStockStatus(item.stock);
            return `
              <tr role="link" data-id="${item.id}">
                <td class="font-mono">#${item.id}</td>
                <td style="font-weight: 500">${item.brand}</td>
                <td>${item.model}</td>
                <td>${item.year}</td>
                <td class="font-mono">${formatPrice(item.price)}</td>
                <td>
                  <span class="badge ${stockStatus.badgeClass}">
                    <span class="stock-dot ${stockStatus.dotClass}"></span>
                    ${item.stock}
                  </span>
                </td>
              </tr>
            `;
          }).join('') : `<tr><td colspan="6" style="text-align: center; padding: 24px;">No items found</td></tr>`}
        </tbody>
      </table>
    </div>
  `;

  return {
    html,
    mount() {
      // Action cards navigation
      document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', () => {
          navigate(card.getAttribute('data-route'));
        });
      });

      // Table row navigation
      document.querySelectorAll('.home-table tr[role="link"]').forEach(row => {
        row.addEventListener('click', () => {
          const id = row.getAttribute('data-id');
          navigate(`/search?id=${id}`);
        });
      });

      // GSAP Animations
      if (window.gsap) {
        gsap.from('.stat-card', { opacity: 0, y: 24, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
        gsap.from('.action-card', { opacity: 0, y: 24, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.2 });
        gsap.from('.table tbody tr', { opacity: 0, y: 16, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.4 });
      }
    }
  };
}
