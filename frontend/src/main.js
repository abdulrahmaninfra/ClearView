/* ============================================================
   ClearView Windshield — Main Entry Point
   Bootstrap: CSS imports, router registration, navbar render
   ============================================================ */

// ── Styles ──
import './styles/design-tokens.css';
import './styles/reset.css';
import './styles/global.css';
import './styles/components.css';
import './styles/navbar.css';
import './styles/toast.css';
import './styles/pages/home.css';
import './styles/pages/search.css';
import './styles/pages/trade.css';
import './styles/pages/update.css';
import './styles/pages/delete.css';

// ── Core ──
import { route, initRouter } from './router.js';
import { renderNavbar } from './components/navbar.js';

// ── Pages (lazy-ish: these are small modules) ──
import homePage from './pages/home.js';
import searchPage from './pages/search.js';
import tradePage from './pages/trade.js';
import updatePage from './pages/update.js';
import deletePage from './pages/delete.js';

// ── Register routes ──
route('/', homePage);
route('/search', searchPage);
route('/trade', tradePage);
route('/update', updatePage);
route('/delete', deletePage);

// ── Initialize ──
renderNavbar();
initRouter();
