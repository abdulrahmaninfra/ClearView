import { api } from '../services/api.js';
import { icon } from '../components/icons.js';
import { formatPrice, getStockStatus } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { getHashParams, navigate } from '../router.js';
import { validateId } from '../utils/validators.js';

export default async function searchPage() {
  const hashParams = getHashParams();
  const initialId = hashParams.get('id') || '';
  
  let allItems = [];
  let brands = [];
  let currentMode = initialId ? 'id' : 'brand'; // 'id' or 'brand'

  // We can fetch initial data for brand mode
  try {
    allItems = await api.getAll();
    
    // Extract brands and counts
    const brandCounts = {};
    allItems.forEach(item => {
      brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
    });
    
    brands = Object.keys(brandCounts).sort().map(name => ({
      name,
      count: brandCounts[name]
    }));
    
  } catch (err) {
    console.error("Failed to fetch items for brand mode:", err);
  }

  const html = `
    <div class="page-header">
      <h1 class="page-title">Search Inventory</h1>
    </div>

    <div class="tabs search-tabs">
      <button class="tab ${currentMode === 'id' ? 'tab--active' : ''}" data-mode="id">
        ${icon('search', 18)} Search Keyword or ID
      </button>
      <button class="tab ${currentMode === 'brand' ? 'tab--active' : ''}" data-mode="brand">
        ${icon('tag', 18)} Browse by Brand
      </button>
    </div>

    <!-- Mode A: Search by Keyword or ID -->
    <div class="search-id-section ${currentMode === 'id' ? 'active' : ''}">
      <div class="search-form-wrap">
        <form id="search-id-form" class="input-inline">
          <div class="input-group" style="flex: 1;">
            <label for="search-id-input" class="sr-only">Keyword or ID</label>
            <input type="text" id="search-id-input" class="input" placeholder="Enter ID, Brand, Model, or Year..." value="${initialId}">
          </div>
          <button type="submit" class="btn btn-primary">
            ${icon('search', 18)} Search
          </button>
        </form>
      </div>
      <div id="id-result-container"></div>
    </div>

    <!-- Mode B: Browse by Brand -->
    <div class="search-brand-section ${currentMode === 'brand' ? 'active' : ''}">
      <div class="carousel-wrapper">
        <button class="carousel-btn left" id="carousel-left" aria-label="Scroll left">${icon('chevronLeft')}</button>
        
        <div class="brand-carousel" id="brand-carousel">
          <div class="brand-tile brand-tile--active" data-brand="ALL">
            <span class="brand-tile-name">ALL</span>
            <span class="brand-tile-count">${allItems.length} items</span>
          </div>
          ${brands.map(brand => `
            <div class="brand-tile" data-brand="${brand.name}">
              <span class="brand-tile-name">${brand.name}</span>
              <span class="brand-tile-count">${brand.count} items</span>
            </div>
          `).join('')}
        </div>
        
        <button class="carousel-btn right" id="carousel-right" aria-label="Scroll right">${icon('chevronRight')}</button>
      </div>

      <div class="results-grid" id="brand-results-grid">
        ${renderResultCards(allItems)}
      </div>
    </div>
  `;

  function renderResultCards(items) {
    if (items.length === 0) {
      return `
        <div class="empty-state" style="grid-column: 1 / -1;">
          ${icon('search', 48)}
          <h3 class="empty-state-title">No items found</h3>
        </div>
      `;
    }
    
    return items.map(item => {
      const stockStatus = getStockStatus(item.stock);
      return `
        <div class="card result-card card--hover" data-id="${item.id}">
          <div class="result-card-header">
            <div>
              <div class="result-brand">${item.brand}</div>
              <div class="result-model-year">${item.model} • ${item.year}</div>
            </div>
            <span class="badge ${stockStatus.badgeClass}">
              <span class="stock-dot ${stockStatus.dotClass}"></span>
              ${item.stock}
            </span>
          </div>
          <div class="result-card-body">
            <div class="result-detail">
              <span class="result-detail-label">Glass Type</span>
              <span class="result-detail-value">${item.glass_type}</span>
            </div>
            <div class="result-detail">
              <span class="result-detail-label">Price</span>
              <span class="result-detail-value font-mono">${formatPrice(item.price)}</span>
            </div>
          </div>
          <div class="result-card-footer">
            <span class="result-id">ID: #${item.id}</span>
            <button class="btn btn-outline btn-icon" title="Trade" onclick="event.stopPropagation(); window.location.hash='#/trade?id=${item.id}'">
              ${icon('package')}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  return {
    html,
    mount() {
      const tabs = document.querySelectorAll('.search-tabs .tab');
      const idSection = document.querySelector('.search-id-section');
      const brandSection = document.querySelector('.search-brand-section');
      
      // Tab switching
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('tab--active'));
          tab.classList.add('tab--active');
          
          const mode = tab.getAttribute('data-mode');
          if (mode === 'id') {
            idSection.classList.add('active');
            brandSection.classList.remove('active');
          } else {
            idSection.classList.remove('active');
            brandSection.classList.add('active');
          }
        });
      });

      // Search by ID logic
      const idForm = document.getElementById('search-id-form');
      const idInput = document.getElementById('search-id-input');
      const idResultContainer = document.getElementById('id-result-container');

      async function performIdSearch(queryStr) {
        if (!queryStr.trim()) {
          idResultContainer.innerHTML = '';
          idInput.classList.remove('input--error');
          return;
        }
        idInput.classList.remove('input--error');
        
        try {
          // If purely digits, try ID search first
          if (/^\d+$/.test(queryStr.trim())) {
            try {
              const item = await api.getById(queryStr.trim());
              idResultContainer.innerHTML = `<div class="results-grid">${renderResultCards([item])}</div>`;
              const card = idResultContainer.querySelector('.result-card');
              if(card) {
                card.addEventListener('click', () => navigate(`/update?id=${item.id}`));
              }
              return; // Success
            } catch (err) {
              // ID not found, fall through to text search
            }
          }

          // Otherwise, perform client-side filtering over pre-fetched items for instant speed
          const terms = queryStr.toLowerCase().trim().split(/\s+/);
          
          const filtered = allItems.filter(i => {
            const searchableText = `${i.brand} ${i.model} ${i.year}`.toLowerCase();
            return terms.every(term => searchableText.includes(term));
          });
          
          idResultContainer.innerHTML = `<div class="results-grid">${renderResultCards(filtered)}</div>`;
          
          idResultContainer.querySelectorAll('.result-card').forEach(card => {
            card.addEventListener('click', () => navigate(`/update?id=${card.getAttribute('data-id')}`));
          });
          
        } catch (err) {
          idResultContainer.innerHTML = '';
          showToast(`Search failed: ${err.message}`, 'error');
        }
      }

      // 1. Instant search as you type
      idInput.addEventListener('input', () => {
        performIdSearch(idInput.value);
      });

      // 2. Prevent the page from reloading if they still press enter
      idForm.addEventListener('submit', (e) => {
        e.preventDefault();
      });

      // Auto-search if ID was in URL
      if (initialId) {
        performIdSearch(initialId);
      }

      // Browse by Brand logic
      const carousel = document.getElementById('brand-carousel');
      const btnLeft = document.getElementById('carousel-left');
      const btnRight = document.getElementById('carousel-right');
      const brandTiles = document.querySelectorAll('.brand-tile');
      const resultsGrid = document.getElementById('brand-results-grid');

      // Carousel scrolling
      if (btnLeft && btnRight && carousel) {
        const scrollAmount = 140 * 2 + 12; // 2 tiles + gap
        btnLeft.addEventListener('click', () => {
          carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        btnRight.addEventListener('click', () => {
          carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
      }

      // Brand selection
      brandTiles.forEach(tile => {
        tile.addEventListener('click', async () => {
          // Update active state
          brandTiles.forEach(t => t.classList.remove('brand-tile--active'));
          tile.classList.add('brand-tile--active');

          const selectedBrand = tile.getAttribute('data-brand');
          
          // Animate out
          resultsGrid.classList.add('results-grid--loading');
          
          try {
            let filteredItems = [];
            if (selectedBrand === 'ALL') {
              filteredItems = allItems;
            } else {
              filteredItems = await api.getAll({ brand: selectedBrand });
            }
            
            // Render new items
            setTimeout(() => {
              resultsGrid.innerHTML = renderResultCards(filteredItems);
              resultsGrid.classList.remove('results-grid--loading');
              
              // Bind clicks to new cards
              resultsGrid.querySelectorAll('.result-card').forEach(card => {
                card.addEventListener('click', () => {
                  navigate(`/update?id=${card.getAttribute('data-id')}`);
                });
              });
            }, 150); // wait for fade out
            
          } catch (err) {
            showToast('Failed to load items', 'error');
            resultsGrid.classList.remove('results-grid--loading');
          }
        });
      });

      // Initial binding for 'ALL' cards
      resultsGrid.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('click', () => {
          navigate(`/update?id=${card.getAttribute('data-id')}`);
        });
      });
      
      if (window.gsap) {
        gsap.from('.result-card', { opacity: 0, y: 16, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
      }
    }
  };
}
