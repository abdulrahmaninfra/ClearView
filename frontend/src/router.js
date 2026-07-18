/* ClearView — Hash-based SPA Router */

const routes = {};
let currentCleanup = null;

/**
 * Register a route.
 * @param {string} path - Hash path, e.g. '/' or '/search'
 * @param {Function} handler - Async function that returns { html: string, mount?: Function, cleanup?: Function }
 */
export function route(path, handler) {
  routes[path] = handler;
}

/**
 * Navigate to a hash route.
 * @param {string} path - e.g. '/search'
 */
export function navigate(path) {
  window.location.hash = `#${path}`;
}

/**
 * Get the current hash path.
 * @returns {string}
 */
function getCurrentPath() {
  const hash = window.location.hash.slice(1) || '/';
  // Separate path from query string
  return hash.split('?')[0];
}

/**
 * Get query params from the hash.
 * @returns {URLSearchParams}
 */
export function getHashParams() {
  const hash = window.location.hash.slice(1) || '/';
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return new URLSearchParams();
  return new URLSearchParams(hash.slice(qIndex + 1));
}

/**
 * Initialize the router and handle route changes.
 */
export function initRouter() {
  const app = document.getElementById('app');

  async function handleRoute() {
    const path = getCurrentPath();
    const handler = routes[path] || routes['/'];

    if (!handler) {
      app.innerHTML = `
        <div class="empty-state">
          <h2 class="empty-state-title">Page Not Found</h2>
          <p class="empty-state-text">The page you're looking for doesn't exist.</p>
          <button class="btn btn-primary" onclick="location.hash='#/'">Go Home</button>
        </div>
      `;
      return;
    }

    // Cleanup previous page
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }

    // Fade out
    app.style.opacity = '0';
    app.style.transform = 'translateY(4px)';

    // Small delay for transition
    await new Promise((r) => setTimeout(r, 120));

    try {
      const result = await handler();
      app.innerHTML = result.html;

      // Fade in
      requestAnimationFrame(() => {
        app.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
        app.style.opacity = '1';
        app.style.transform = 'translateY(0)';
      });

      // Mount event handlers
      if (result.mount) {
        result.mount();
      }

      // Store cleanup
      if (result.cleanup) {
        currentCleanup = result.cleanup;
      }
    } catch (err) {
      console.error('Route error:', err);
      app.innerHTML = `
        <div class="empty-state">
          <h2 class="empty-state-title">Something went wrong</h2>
          <p class="empty-state-text">${err.message}</p>
          <button class="btn btn-primary" onclick="location.hash='#/'">Go Home</button>
        </div>
      `;
      app.style.opacity = '1';
      app.style.transform = 'translateY(0)';
    }

    // Update active nav link
    updateNavActive(path);
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

/**
 * Update the active state on nav links.
 */
function updateNavActive(path) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    const linkPath = link.getAttribute('data-path');
    if (linkPath === path) {
      link.classList.add('nav-link--active');
    } else {
      link.classList.remove('nav-link--active');
    }
  });
}
