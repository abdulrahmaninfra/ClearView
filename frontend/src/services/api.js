/* ============================================================
   ClearView Windshield — API Service
   Centralized fetch wrapper for all FastAPI endpoints.
   ============================================================ */

const API_BASE = '/api';

async function fetchJSON(endpoint, options = {}) {
  const { method = 'GET', body, params } = options;

  let url = `${API_BASE}${endpoint}`;

  // Append query params
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const config = {
    method,
    headers: {},
  };

  if (body) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const errData = await response.json();
      detail = errData.detail || detail;
    } catch {
      // response wasn't JSON
    }
    throw new Error(detail);
  }

  return response.json();
}

export const api = {
  /** GET all windshields with optional filters { brand, model, year } */
  getAll: (params = {}) => fetchJSON('/windshield', { params }),

  /** GET single windshield by ID */
  getById: (id) => fetchJSON(`/windshield/${id}`),

  /** POST create new windshield */
  create: (data) => fetchJSON('/windshield', { method: 'POST', body: data }),

  /** PUT update windshield fields (partial update) */
  update: (id, data) => fetchJSON(`/windshield/${id}`, { method: 'PUT', body: data }),

  /** DELETE windshield by ID */
  delete: (id) => fetchJSON(`/windshield/${id}`, { method: 'DELETE' }),
};
