/* ClearView — Lucide SVG Icon helpers
   Inline SVG icons from Lucide (https://lucide.dev)
   All icons: 24x24, stroke-width 1.5, stroke currentColor */

const s = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

export const icons = {
  layoutDashboard: `<svg ${s}><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,

  search: `<svg ${s}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,

  packagePlus: `<svg ${s}><path d="M16 16h6"/><path d="M19 13v6"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>`,

  packageMinus: `<svg ${s}><path d="M16 16h6"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>`,

  pencil: `<svg ${s}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>`,

  trash2: `<svg ${s}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,

  tag: `<svg ${s}><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>`,

  hash: `<svg ${s}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,

  trendingUp: `<svg ${s}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,

  trendingDown: `<svg ${s}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>`,

  circleCheck: `<svg ${s}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,

  circleX: `<svg ${s}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,

  triangleAlert: `<svg ${s}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,

  chevronLeft: `<svg ${s}><path d="m15 18-6-6 6-6"/></svg>`,

  chevronRight: `<svg ${s}><path d="m9 18 6-6-6-6"/></svg>`,

  x: `<svg ${s}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,

  shieldCheck: `<svg ${s}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,

  info: `<svg ${s}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,

  box: `<svg ${s}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,

  dollarSign: `<svg ${s}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,

  arrowRight: `<svg ${s}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,

  arrowLeft: `<svg ${s}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,

  minus: `<svg ${s}><path d="M5 12h14"/></svg>`,

  plus: `<svg ${s}><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,

  rotateCcw: `<svg ${s}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,

  package: `<svg ${s}><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73Z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/></svg>`,
};

/**
 * Get an icon SVG string by name, optionally with custom size.
 * @param {string} name - Icon name (camelCase)
 * @param {number} [size=24] - Icon size in px
 * @returns {string} SVG string
 */
export function icon(name, size = 24) {
  const svg = icons[name] || icons.info;
  if (size === 24) return svg;
  return svg
    .replace('width="24"', `width="${size}"`)
    .replace('height="24"', `height="${size}"`);
}
