import { renderHome } from './pages/home.js';
import { renderPaste } from './pages/paste.js';

let currentRoute = '';

export function initRouter() {
  // Handle initial route
  handleRoute();

  // Handle browser navigation
  window.addEventListener('popstate', handleRoute);

  // Handle link clicks
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      navigate(href);
    }
  });
}

function handleRoute() {
  const path = window.location.pathname;
  currentRoute = path;

  // Clear app container
  const app = document.getElementById('app');
  if (!app) return;

  if (path === '/' || path === '') {
    renderHome();
  } else if (path.startsWith('/')) {
    const id = path.slice(1);
    if (id && id.length >= 4) {
      renderPaste(id);
    } else {
      renderHome();
    }
  } else {
    renderHome();
  }
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  handleRoute();
}

export function getCurrentRoute() {
  return currentRoute;
}

