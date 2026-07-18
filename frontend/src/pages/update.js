import { api } from '../services/api.js';
import { icon } from '../components/icons.js';
import { formatPrice } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { validateId, validatePrice, validateYear, validateRequired } from '../utils/validators.js';
import { getHashParams } from '../router.js';

export default async function updatePage() {
  const hashParams = getHashParams();
  const initialId = hashParams.get('id') || '';

  let originalItem = null;
  let changedFields = {};

  const html = `
    <div class="page-header">
      <h1 class="page-title">Update Item Details</h1>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator" id="update-steps">
      <div class="step-item active" id="step1-marker">
        <div class="step-dot step-dot--active">1</div>
        <div class="step-label">Edit</div>
      </div>
      <div class="step-line" id="step-line-1"></div>
      <div class="step-item" id="step2-marker">
        <div class="step-dot">2</div>
        <div class="step-label">Verify & Confirm</div>
      </div>
    </div>

    <!-- STEP 1: Edit -->
    <div class="update-step active" id="step1-container">
      <div class="trade-lookup">
        <form id="update-lookup-form" class="input-inline">
          <div class="input-group" style="flex: 1;">
            <label for="update-id-input" class="sr-only">Windshield ID</label>
            <input type="number" id="update-id-input" class="input" placeholder="Enter Windshield ID..." value="${initialId}">
          </div>
          <button type="submit" class="btn btn-primary">
            ${icon('search', 18)} Lookup
          </button>
        </form>
      </div>

      <div id="update-form-area" style="display: none;">
        <form id="update-form">
          <div class="update-form">
            <div class="input-group">
              <label class="input-label" for="field-brand">Brand</label>
              <input type="text" id="field-brand" class="input" name="brand">
            </div>
            <div class="input-group">
              <label class="input-label" for="field-model">Model</label>
              <input type="text" id="field-model" class="input" name="model">
            </div>
            <div class="input-group">
              <label class="input-label" for="field-year">Year</label>
              <input type="number" id="field-year" class="input" name="year">
            </div>
            <div class="input-group">
              <label class="input-label" for="field-glass">Glass Type</label>
              <input type="text" id="field-glass" class="input" name="glass_type">
            </div>
            <div class="input-group">
              <label class="input-label" for="field-price">Price ($)</label>
              <input type="number" step="0.01" id="field-price" class="input font-mono" name="price">
            </div>
            <!-- Stock is intentionally omitted from update form -->
          </div>
          <div class="update-actions">
            <button type="button" class="btn btn-outline" id="btn-reset">
              ${icon('rotateCcw', 16)} Reset Form
            </button>
            <button type="button" class="btn btn-primary" id="btn-proceed" disabled title="No changes detected">
              Proceed to Verification ${icon('arrowRight', 16)}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- STEP 2: Verify -->
    <div class="update-step" id="step2-container">
      <div class="alert alert--info mb-4">
        ${icon('shieldCheck')}
        <div>
          <strong>Verification Required</strong><br/>
          Review your changes before submitting.
        </div>
      </div>

      <div id="diff-container"></div>

      <div class="verification-box">
        <label class="input-label">To confirm, type the item ID:</label>
        <input type="text" id="verify-id-input" class="input verify-input" placeholder="ID" autocomplete="off">
        <div id="verify-error" class="input-error-msg" style="display: none;">ID does not match.</div>
      </div>

      <div class="update-actions" style="margin-top: var(--space-4);">
        <button type="button" class="btn btn-outline" id="btn-back">
          ${icon('arrowLeft', 16)} Back to Edit
        </button>
        <button type="button" class="btn btn-accent" id="btn-confirm-update" disabled>
          ${icon('circleCheck', 16)} Confirm Update
        </button>
      </div>
    </div>
  `;

  return {
    html,
    mount() {
      // Step 1 Elements
      const lookupForm = document.getElementById('update-lookup-form');
      const idInput = document.getElementById('update-id-input');
      const formArea = document.getElementById('update-form-area');
      const updateForm = document.getElementById('update-form');
      const btnReset = document.getElementById('btn-reset');
      const btnProceed = document.getElementById('btn-proceed');

      // Step 2 Elements
      const step1Container = document.getElementById('step1-container');
      const step2Container = document.getElementById('step2-container');
      const diffContainer = document.getElementById('diff-container');
      const verifyInput = document.getElementById('verify-id-input');
      const verifyError = document.getElementById('verify-error');
      const btnBack = document.getElementById('btn-back');
      const btnConfirm = document.getElementById('btn-confirm-update');

      // Markers
      const step1Marker = document.querySelector('#step1-marker .step-dot');
      const stepLine = document.getElementById('step-line-1');
      const step2Marker = document.querySelector('#step2-marker .step-dot');

      // ── STEP 1 LOGIC ──
      
      async function fetchItem(idStr) {
        if (!validateId(idStr).valid) return;
        try {
          originalItem = await api.getById(idStr);
          populateForm(originalItem);
          formArea.style.display = 'block';
          checkChanges(); // disable proceed button initially
        } catch (err) {
          showToast(`Item #${idStr} not found`, 'error');
          formArea.style.display = 'none';
        }
      }

      function populateForm(item) {
        document.getElementById('field-brand').value = item.brand;
        document.getElementById('field-model').value = item.model;
        document.getElementById('field-year').value = item.year;
        document.getElementById('field-glass').value = item.glass_type;
        document.getElementById('field-price').value = item.price;
      }

      lookupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fetchItem(idInput.value);
      });

      if(initialId) fetchItem(initialId);

      btnReset.addEventListener('click', () => {
        if (originalItem) populateForm(originalItem);
        checkChanges();
      });

      // Monitor changes
      updateForm.addEventListener('input', checkChanges);

      function checkChanges() {
        if (!originalItem) return;
        
        changedFields = {};
        const brand = document.getElementById('field-brand').value.trim();
        const model = document.getElementById('field-model').value.trim();
        const year = parseInt(document.getElementById('field-year').value);
        const glass = document.getElementById('field-glass').value.trim();
        const price = parseFloat(document.getElementById('field-price').value);

        if (brand !== originalItem.brand) changedFields.brand = brand;
        if (model !== originalItem.model) changedFields.model = model;
        if (year !== originalItem.year && !isNaN(year)) changedFields.year = year;
        if (glass !== originalItem.glass_type) changedFields.glass_type = glass;
        if (price !== originalItem.price && !isNaN(price)) changedFields.price = price;

        const hasChanges = Object.keys(changedFields).length > 0;
        btnProceed.disabled = !hasChanges;
        btnProceed.title = hasChanges ? '' : 'No changes detected';
      }

      btnProceed.addEventListener('click', () => {
        // Validate form before proceeding
        if(changedFields.price !== undefined && !validatePrice(changedFields.price).valid) {
           showToast('Invalid price', 'error'); return;
        }
        if(changedFields.year !== undefined && !validateYear(changedFields.year).valid) {
           showToast('Invalid year', 'error'); return;
        }

        renderDiff();
        
        // Transition to step 2
        step1Container.classList.remove('active');
        step2Container.classList.add('active');
        
        step1Marker.classList.replace('step-dot--active', 'step-dot--complete');
        step1Marker.innerHTML = icon('circleCheck', 16);
        stepLine.classList.add('step-line--complete');
        step2Marker.classList.add('step-dot--active');
        
        verifyInput.value = '';
        verifyInput.classList.remove('input--success');
        btnConfirm.disabled = true;
        verifyError.style.display = 'none';
      });

      // ── STEP 2 LOGIC ──

      function renderDiff() {
        const fields = ['brand', 'model', 'year', 'glass_type', 'price'];
        
        let rowsHtml = fields.map(field => {
          const isChanged = changedFields.hasOwnProperty(field);
          const oldVal = field === 'price' ? formatPrice(originalItem[field]) : originalItem[field];
          const newValRaw = isChanged ? changedFields[field] : originalItem[field];
          const newVal = field === 'price' ? formatPrice(newValRaw) : newValRaw;

          const rowClass = isChanged ? 'diff-changed' : 'diff-unchanged';
          const marker = isChanged ? '←' : '';
          
          const label = field.replace('_', ' ').toUpperCase();

          return `
            <tr class="${rowClass}">
              <td><strong>${label}</strong></td>
              <td>${oldVal}</td>
              <td>${newVal} <span style="color: var(--color-accent); font-weight: bold; margin-left: 8px;">${marker}</span></td>
            </tr>
          `;
        }).join('');

        diffContainer.innerHTML = `
          <div class="table-wrap">
            <table class="diff-table">
              <thead>
                <tr>
                  <th style="width: 25%">FIELD</th>
                  <th>CURRENT VALUE</th>
                  <th>NEW VALUE</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        `;
      }

      verifyInput.addEventListener('input', () => {
        const val = verifyInput.value.trim();
        if (val === String(originalItem.id)) {
          verifyInput.classList.add('input--success');
          verifyInput.classList.remove('input--error');
          verifyError.style.display = 'none';
          btnConfirm.disabled = false;
        } else {
          verifyInput.classList.remove('input--success');
          btnConfirm.disabled = true;
          if (val.length >= String(originalItem.id).length) {
            verifyInput.classList.add('input--error');
            verifyError.style.display = 'block';
          } else {
            verifyInput.classList.remove('input--error');
            verifyError.style.display = 'none';
          }
        }
      });

      btnBack.addEventListener('click', () => {
        step2Container.classList.remove('active');
        step1Container.classList.add('active');
        
        step1Marker.classList.replace('step-dot--complete', 'step-dot--active');
        step1Marker.innerHTML = '1';
        stepLine.classList.remove('step-line--complete');
        step2Marker.classList.remove('step-dot--active');
      });

      btnConfirm.addEventListener('click', async () => {
        btnConfirm.disabled = true;
        try {
          await api.update(originalItem.id, changedFields);
          showToast(`✅ Item #${originalItem.id} updated successfully`, 'success');
          
          // Reset flow
          originalItem = null;
          changedFields = {};
          formArea.style.display = 'none';
          idInput.value = '';
          btnBack.click(); // go back to step 1
        } catch(err) {
          showToast(err.message, 'error');
          btnConfirm.disabled = false;
        }
      });
    }
  };
}
