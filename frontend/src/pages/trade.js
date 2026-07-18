import { api } from '../services/api.js';
import { icon } from '../components/icons.js';
import { formatPrice, getStockStatus, stockPercentage } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { validateId } from '../utils/validators.js';
import { getHashParams } from '../router.js';

export default async function tradePage() {
  const hashParams = getHashParams();
  const initialId = hashParams.get('id') || '';
  
  let currentItem = null;

  const html = `
    <div class="page-header">
      <h1 class="page-title">Trade Inventory</h1>
      <p class="page-subtitle">Buy (stock in) or sell (stock out) items.</p>
    </div>

    <!-- Step 1: Lookup -->
    <div class="trade-lookup">
      <h2 class="section-title">Step 1: Find Item</h2>
      <form id="trade-lookup-form" class="input-inline">
        <div class="input-group" style="flex: 1;">
          <label for="trade-id-input" class="sr-only">Windshield ID</label>
          <input type="number" id="trade-id-input" class="input" placeholder="Enter Windshield ID..." value="${initialId}">
        </div>
        <button type="submit" class="btn btn-primary">
          ${icon('search', 18)} Lookup
        </button>
      </form>
    </div>

    <div id="trade-content-area"></div>
  `;

  function renderTradeContent(item) {
    const status = getStockStatus(item.stock);
    const pct = stockPercentage(item.stock);

    return `
      <!-- Preview Card -->
      <div class="trade-preview active">
        <div class="card">
          <div class="result-brand">${item.brand} • ${item.model} • ${item.year}</div>
          <div class="result-model-year">Glass: ${item.glass_type} | Price: ${formatPrice(item.price)} | ID: #${item.id}</div>
          
          <div class="stock-bar-container">
            <div class="stock-bar-label">
              <span>Current Stock</span>
              <span class="font-mono">${item.stock} units</span>
            </div>
            <div class="stock-bar">
              <div class="stock-bar-fill ${status.dotClass.replace('dot', 'fill')}" style="width: ${pct}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Trade Panels -->
      <h2 class="section-title">Step 2: Trade Action</h2>
      <div class="trade-panels">
        
        <!-- BUY PANEL -->
        <div class="trade-panel trade-panel--buy">
          <div class="trade-panel-header">
            ${icon('packagePlus')} BUY (Stock In)
          </div>
          <div class="counter-label">How many to add?</div>
          <div class="stock-counter">
            <button type="button" class="counter-btn" id="buy-minus">${icon('minus', 16)}</button>
            <input type="number" id="buy-input" class="counter-input" value="1" min="1" max="999">
            <button type="button" class="counter-btn" id="buy-plus">${icon('plus', 16)}</button>
          </div>
          <div class="stock-preview">
            New Stock: <strong id="buy-preview">${item.stock + 1}</strong>
          </div>
          <div class="trade-panel-footer">
            <button class="btn btn-accent" style="width: 100%" id="btn-confirm-buy">
              ${icon('circleCheck', 18)} CONFIRM BUY
            </button>
          </div>
        </div>

        <!-- SELL PANEL -->
        <div class="trade-panel trade-panel--sell">
          <div class="trade-panel-header">
            ${icon('packageMinus')} SELL (Stock Out)
          </div>
          <div class="counter-label">How many to sell?</div>
          <div class="stock-counter">
            <button type="button" class="counter-btn" id="sell-minus">${icon('minus', 16)}</button>
            <input type="number" id="sell-input" class="counter-input" value="1" min="1">
            <button type="button" class="counter-btn" id="sell-plus">${icon('plus', 16)}</button>
          </div>
          <div class="stock-preview">
            <span id="sell-preview-wrap">New Stock: <strong id="sell-preview">${item.stock - 1}</strong></span>
            <div id="sell-error" class="input-error-msg" style="display: none; margin-top: 4px;">Cannot sell more than ${item.stock}</div>
          </div>
          <div class="trade-panel-footer">
            <button class="btn btn-destructive" style="width: 100%" id="btn-confirm-sell">
              ${icon('circleCheck', 18)} CONFIRM SELL
            </button>
          </div>
        </div>

      </div>
    `;
  }

  return {
    html,
    mount() {
      const lookupForm = document.getElementById('trade-lookup-form');
      const idInput = document.getElementById('trade-id-input');
      const contentArea = document.getElementById('trade-content-area');

      async function fetchItem(idStr) {
        const val = validateId(idStr);
        if (!val.valid) {
          showToast(val.message, 'error');
          return;
        }
        
        try {
          currentItem = await api.getById(idStr);
          contentArea.innerHTML = renderTradeContent(currentItem);
          bindTradeEvents();
        } catch (err) {
          contentArea.innerHTML = '';
          currentItem = null;
          showToast(`Item #${idStr} not found`, 'error');
        }
      }

      lookupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fetchItem(idInput.value);
      });

      if (initialId) {
        fetchItem(initialId);
      }

      function bindTradeEvents() {
        if (!currentItem) return;
        const currentStock = currentItem.stock;

        // Buy Elements
        const buyMinus = document.getElementById('buy-minus');
        const buyPlus = document.getElementById('buy-plus');
        const buyInput = document.getElementById('buy-input');
        const buyPreview = document.getElementById('buy-preview');
        const btnBuy = document.getElementById('btn-confirm-buy');

        // Sell Elements
        const sellMinus = document.getElementById('sell-minus');
        const sellPlus = document.getElementById('sell-plus');
        const sellInput = document.getElementById('sell-input');
        const sellPreview = document.getElementById('sell-preview');
        const sellError = document.getElementById('sell-error');
        const btnSell = document.getElementById('btn-confirm-sell');

        // --- BUY LOGIC ---
        function updateBuy() {
          let val = parseInt(buyInput.value) || 0;
          if (val < 1) val = 1;
          buyInput.value = val;
          buyPreview.textContent = currentStock + val;
        }

        buyMinus.addEventListener('click', () => { buyInput.value = Math.max(1, parseInt(buyInput.value || 0) - 1); updateBuy(); });
        buyPlus.addEventListener('click', () => { buyInput.value = parseInt(buyInput.value || 0) + 1; updateBuy(); });
        buyInput.addEventListener('input', updateBuy);
        buyInput.addEventListener('blur', updateBuy);

        btnBuy.addEventListener('click', async () => {
          const qty = parseInt(buyInput.value);
          const newStock = currentStock + qty;
          btnBuy.disabled = true;
          try {
            await api.update(currentItem.id, { stock: newStock });
            showToast(`✅ Added ${qty} units. Total stock is now ${newStock}`, 'success');
            fetchItem(currentItem.id); // refresh UI
          } catch (err) {
            showToast(err.message, 'error');
            btnBuy.disabled = false;
          }
        });

        // --- SELL LOGIC ---
        function updateSell() {
          let val = parseInt(sellInput.value) || 0;
          if (val < 1) val = 1;
          sellInput.value = val;
          
          if (val > currentStock) {
            sellInput.classList.add('error');
            sellError.style.display = 'block';
            btnSell.disabled = true;
            sellPreview.textContent = "Invalid";
          } else {
            sellInput.classList.remove('error');
            sellError.style.display = 'none';
            btnSell.disabled = false;
            sellPreview.textContent = currentStock - val;
          }
        }

        sellMinus.addEventListener('click', () => { sellInput.value = Math.max(1, parseInt(sellInput.value || 0) - 1); updateSell(); });
        sellPlus.addEventListener('click', () => { sellInput.value = parseInt(sellInput.value || 0) + 1; updateSell(); });
        sellInput.addEventListener('input', updateSell);
        sellInput.addEventListener('blur', updateSell);
        
        // Initial check for sell (if stock is 0)
        if (currentStock === 0) {
           sellInput.value = 0;
           sellInput.disabled = true;
           sellMinus.disabled = true;
           sellPlus.disabled = true;
           btnSell.disabled = true;
           sellPreview.textContent = "0";
           sellError.textContent = "Out of stock";
           sellError.style.display = 'block';
        } else {
           updateSell();
        }

        btnSell.addEventListener('click', async () => {
          const qty = parseInt(sellInput.value);
          const newStock = currentStock - qty;
          btnSell.disabled = true;
          try {
            await api.update(currentItem.id, { stock: newStock });
            showToast(`📤 Sold ${qty} units. Remaining stock is ${newStock}`, 'success');
            fetchItem(currentItem.id); // refresh UI
          } catch (err) {
            showToast(err.message, 'error');
            btnSell.disabled = false;
          }
        });
      }
    }
  };
}
