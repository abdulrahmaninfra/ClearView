import { api } from '../services/api.js';
import { icon } from '../components/icons.js';
import { formatPrice } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { validateId } from '../utils/validators.js';
import { navigate, getHashParams } from '../router.js';

export default async function deletePage() {
  const hashParams = getHashParams();
  const initialId = hashParams.get('id') || '';

  let originalItem = null;
  let targetPhrase = '';
  let redirectTimer = null;

  const html = `
    <div class="page-header">
      <h1 class="page-title">Delete Item</h1>
    </div>

    <div class="delete-warning">
      ${icon('triangleAlert', 24)}
      This action is permanent and cannot be undone.
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator" id="delete-steps">
      <div class="step-item active" id="del-step1-marker">
        <div class="step-dot step-dot--active">1</div>
        <div class="step-label">Find</div>
      </div>
      <div class="step-line" id="del-step-line-1"></div>
      
      <div class="step-item" id="del-step2-marker">
        <div class="step-dot">2</div>
        <div class="step-label">Review</div>
      </div>
      <div class="step-line" id="del-step-line-2"></div>
      
      <div class="step-item" id="del-step3-marker">
        <div class="step-dot">3</div>
        <div class="step-label">Confirm</div>
      </div>
    </div>

    <!-- STEP 1: Find -->
    <div class="delete-step active" id="del-step1-container">
      <div class="trade-lookup">
        <form id="delete-lookup-form" class="input-inline">
          <div class="input-group" style="flex: 1;">
            <label for="delete-id-input" class="sr-only">Windshield ID</label>
            <input type="number" id="delete-id-input" class="input" placeholder="Enter Windshield ID..." value="${initialId}">
          </div>
          <button type="submit" class="btn btn-primary">
            ${icon('search', 18)} Lookup
          </button>
        </form>
      </div>

      <div id="delete-item-preview"></div>
    </div>

    <!-- STEP 2: Review -->
    <div class="delete-step" id="del-step2-container">
      <div class="delete-header">
        ${icon('triangleAlert')} YOU ARE ABOUT TO DELETE THIS ITEM
      </div>
      
      <div id="delete-full-preview"></div>

      <div class="impact-summary">
        <div class="impact-summary-title">${icon('info', 18)} IMPACT SUMMARY:</div>
        <ul class="impact-list" id="impact-list">
          <!-- populated dynamically -->
        </ul>
      </div>

      <label class="checkbox-group" style="border-color: var(--color-destructive);">
        <input type="checkbox" id="ack-checkbox">
        <span class="checkbox-label" id="ack-label">I understand this will permanently delete item and all associated data.</span>
      </label>

      <div class="update-actions" style="margin-top: var(--space-5);">
        <button type="button" class="btn btn-outline" id="del-btn-back1">
          ${icon('arrowLeft', 16)} Back
        </button>
        <button type="button" class="btn btn-destructive" id="del-btn-proceed2" disabled>
          Proceed to Final Confirm ${icon('arrowRight', 16)}
        </button>
      </div>
    </div>

    <!-- STEP 3: Confirm -->
    <div class="delete-step" id="del-step3-container">
      <div class="alert alert--danger mb-4">
        ${icon('shieldCheck')}
        <div>
          <strong>FINAL VERIFICATION</strong><br/>
          To permanently delete this item, type the following phrase exactly:
        </div>
      </div>

      <div class="phrase-display" id="phrase-display"></div>

      <input type="text" id="phrase-input" class="input phrase-input" placeholder="Type here..." autocomplete="off">

      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" id="match-progress-fill" style="width: 0%; background: var(--color-destructive);"></div>
        </div>
        <div class="progress-text" id="match-progress-text">0% matched</div>
      </div>

      <div class="update-actions" style="margin-top: var(--space-5);">
        <button type="button" class="btn btn-outline" id="del-btn-back2">
          ${icon('x', 16)} Cancel
        </button>
        <button type="button" class="btn btn-destructive delete-btn-final" id="btn-final-delete" disabled>
          ${icon('trash2', 18)} PERMANENTLY DELETE
        </button>
      </div>
    </div>
  `;

  return {
    html,
    mount() {
      // Step 1
      const lookupForm = document.getElementById('delete-lookup-form');
      const idInput = document.getElementById('delete-id-input');
      const previewArea = document.getElementById('delete-item-preview');
      
      // Step 2
      const step1Cont = document.getElementById('del-step1-container');
      const step2Cont = document.getElementById('del-step2-container');
      const fullPreview = document.getElementById('delete-full-preview');
      const impactList = document.getElementById('impact-list');
      const ackCheckbox = document.getElementById('ack-checkbox');
      const ackLabel = document.getElementById('ack-label');
      const btnBack1 = document.getElementById('del-btn-back1');
      const btnProceed2 = document.getElementById('del-btn-proceed2');

      // Step 3
      const step3Cont = document.getElementById('del-step3-container');
      const phraseDisplay = document.getElementById('phrase-display');
      const phraseInput = document.getElementById('phrase-input');
      const progressFill = document.getElementById('match-progress-fill');
      const progressText = document.getElementById('match-progress-text');
      const btnBack2 = document.getElementById('del-btn-back2');
      const btnFinalDelete = document.getElementById('btn-final-delete');

      // Markers
      const mk1 = document.querySelector('#del-step1-marker .step-dot');
      const l1 = document.getElementById('del-step-line-1');
      const mk2 = document.querySelector('#del-step2-marker .step-dot');
      const l2 = document.getElementById('del-step-line-2');
      const mk3 = document.querySelector('#del-step3-marker .step-dot');

      // --- STEP 1 ---
      async function fetchItem(idStr) {
        if (!validateId(idStr).valid) return;
        try {
          originalItem = await api.getById(idStr);
          renderPreview();
        } catch (err) {
          originalItem = null;
          previewArea.innerHTML = '';
          showToast(`Item #${idStr} not found`, 'error');
        }
      }

      function renderPreview() {
        previewArea.innerHTML = `
          <div class="card result-card" style="margin-top: 16px;">
            <div class="result-brand">${originalItem.brand} • ${originalItem.model} • ${originalItem.year}</div>
            <div class="result-model-year">Glass: ${originalItem.glass_type} | Price: ${formatPrice(originalItem.price)} | Stock: ${originalItem.stock}</div>
            <div style="margin-top: 16px; font-family: monospace; color: var(--color-muted-fg);">ID: #${originalItem.id}</div>
          </div>
          <button class="btn btn-primary" id="btn-proceed1" style="margin-top: 16px;">
            Proceed to Review ${icon('arrowRight', 16)}
          </button>
        `;
        document.getElementById('btn-proceed1').addEventListener('click', goStep2);
      }

      lookupForm.addEventListener('submit', (e) => { e.preventDefault(); fetchItem(idInput.value); });
      if(initialId) fetchItem(initialId);

      // --- STEP 2 ---
      function goStep2() {
        step1Cont.classList.remove('active');
        step2Cont.classList.add('active');
        
        mk1.classList.replace('step-dot--active', 'step-dot--complete');
        mk1.innerHTML = icon('circleCheck', 16);
        l1.classList.add('step-line--complete');
        mk2.classList.add('step-dot--active');

        // Populate details
        fullPreview.innerHTML = `
          <div class="card delete-item-card">
             <div class="detail-row"><span class="detail-label">ID:</span><span class="detail-value">#${originalItem.id}</span></div>
             <div class="detail-row"><span class="detail-label">Brand:</span><span class="detail-value">${originalItem.brand}</span></div>
             <div class="detail-row"><span class="detail-label">Model:</span><span class="detail-value">${originalItem.model}</span></div>
             <div class="detail-row"><span class="detail-label">Year:</span><span class="detail-value">${originalItem.year}</span></div>
             <div class="detail-row"><span class="detail-label">Glass Type:</span><span class="detail-value">${originalItem.glass_type}</span></div>
             <div class="detail-row"><span class="detail-label">Price:</span><span class="detail-value">${formatPrice(originalItem.price)}</span></div>
             <div class="detail-row"><span class="detail-label">Stock:</span><span class="detail-value">${originalItem.stock} units</span></div>
          </div>
        `;

        impactList.innerHTML = `
          <li>${originalItem.stock} units of stock will be lost</li>
          <li>${formatPrice(originalItem.price * originalItem.stock)} total inventory value removed</li>
          <li>This action is irreversible</li>
        `;

        ackLabel.textContent = `I understand this will permanently delete item #${originalItem.id} and all associated data.`;
        ackCheckbox.checked = false;
        btnProceed2.disabled = true;
      }

      ackCheckbox.addEventListener('change', () => {
        btnProceed2.disabled = !ackCheckbox.checked;
      });

      btnBack1.addEventListener('click', () => {
        step2Cont.classList.remove('active');
        step1Cont.classList.add('active');
        mk1.classList.replace('step-dot--complete', 'step-dot--active');
        mk1.innerHTML = '1';
        l1.classList.remove('step-line--complete');
        mk2.classList.remove('step-dot--active');
      });

      // --- STEP 3 ---
      btnProceed2.addEventListener('click', () => {
        step2Cont.classList.remove('active');
        step3Cont.classList.add('active');
        
        mk2.classList.replace('step-dot--active', 'step-dot--complete');
        mk2.innerHTML = icon('circleCheck', 16);
        l2.classList.add('step-line--complete');
        mk3.classList.add('step-dot--active');

        targetPhrase = `DELETE ${originalItem.brand.toUpperCase()} ${originalItem.model.toUpperCase()} ${originalItem.id}`;
        phraseDisplay.textContent = targetPhrase;
        phraseInput.value = '';
        updateProgress();
      });

      btnBack2.addEventListener('click', () => {
        step3Cont.classList.remove('active');
        step2Cont.classList.add('active');
        mk2.classList.replace('step-dot--complete', 'step-dot--active');
        mk2.innerHTML = '2';
        l2.classList.remove('step-line--complete');
        mk3.classList.remove('step-dot--active');
      });

      function updateProgress() {
        const typed = phraseInput.value;
        let matchCount = 0;
        
        // Count exact matching characters from start
        for (let i = 0; i < typed.length; i++) {
          if (typed[i] === targetPhrase[i]) {
            matchCount++;
          } else {
            break; // Stop at first mismatch
          }
        }

        const pct = Math.floor((matchCount / targetPhrase.length) * 100);
        progressFill.style.width = `${pct}%`;
        progressText.textContent = `${pct}% matched`;

        if (pct < 50) progressFill.style.background = 'var(--color-destructive)';
        else if (pct < 100) progressFill.style.background = 'var(--color-warning)';
        else progressFill.style.background = 'var(--color-accent)';

        btnFinalDelete.disabled = (pct !== 100 || typed.length !== targetPhrase.length);
      }

      phraseInput.addEventListener('input', updateProgress);

      btnFinalDelete.addEventListener('click', async () => {
        btnFinalDelete.disabled = true;
        try {
          await api.delete(originalItem.id);
          
          // Success Overlay
          const overlay = document.createElement('div');
          overlay.className = 'delete-success-overlay';
          overlay.innerHTML = `
            ${icon('circleCheck', 80)}
            <h2 class="delete-success-title">Item Deleted</h2>
            <p class="delete-success-text">Item #${originalItem.id} has been permanently removed.</p>
            <p class="delete-success-text" style="margin-top: 16px; font-size: 14px;">Redirecting to dashboard in 3 seconds...</p>
          `;
          document.body.appendChild(overlay);

          redirectTimer = setTimeout(() => {
            overlay.remove();
            navigate('/');
          }, 3000);

        } catch(err) {
          showToast(err.message, 'error');
          btnFinalDelete.disabled = false;
        }
      });
    },
    cleanup() {
      if (redirectTimer) clearTimeout(redirectTimer);
      const overlay = document.querySelector('.delete-success-overlay');
      if (overlay) overlay.remove();
    }
  };
}
