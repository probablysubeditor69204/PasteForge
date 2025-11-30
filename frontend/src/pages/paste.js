import { getPaste, verifyPassword, deletePaste } from '../utils/api.js';
import { navigate } from '../router.js';
import { getTheme, toggleTheme } from '../utils/theme.js';
import hljs from 'highlight.js';

export async function renderPaste(id) {
  const app = document.getElementById('app');
  
  // Show loading state
  app.innerHTML = `
    <div class="min-h-screen">
      <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <a href="/" data-link class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              📝 PasteForge
            </a>
            <button id="theme-toggle" class="btn btn-secondary">
              <span id="theme-icon">🌙</span>
            </button>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Loading paste...</p>
        </div>
      </main>
    </div>
  `;

  // Setup theme toggle
  setupThemeToggle();

  try {
    const paste = await getPaste(id);
    
    if (paste.protected) {
      renderPasswordPrompt(id);
      return;
    }

    renderPasteContent(paste);
  } catch (error) {
    renderError(error.message);
  }
}

function renderPasswordPrompt(id) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="min-h-screen">
      <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <a href="/" data-link class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              📝 PasteForge
            </a>
            <button id="theme-toggle" class="btn btn-secondary">
              <span id="theme-icon">🌙</span>
            </button>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="card max-w-md mx-auto">
          <h2 class="text-2xl font-bold mb-4 text-center">Password Protected</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6 text-center">
            This paste is password protected. Please enter the password to view it.
          </p>
          <form id="password-form" class="space-y-4">
            <input
              type="password"
              id="password-input"
              class="input"
              placeholder="Enter password"
              required
              autofocus
            />
            <button type="submit" class="btn btn-primary w-full">
              Unlock Paste
            </button>
          </form>
          <div id="password-error" class="hidden mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400"></div>
        </div>
      </main>
    </div>
  `;

  setupThemeToggle();

  const form = document.getElementById('password-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password-input').value;
    const errorDiv = document.getElementById('password-error');
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    errorDiv.classList.add('hidden');

    try {
      const paste = await verifyPassword(id, password);
      renderPasteContent(paste);
    } catch (err) {
      errorDiv.textContent = err.message || 'Invalid password';
      errorDiv.classList.remove('hidden');
      submitBtn.disabled = false;
    }
  });
}

function renderPasteContent(paste) {
  const app = document.getElementById('app');
  
  // Format expiry info
  const expiryText = paste.expires === 'never' 
    ? 'Never expires' 
    : `Expires in ${formatExpiry(paste.expires_in)}`;

  app.innerHTML = `
    <div class="min-h-screen">
      <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <a href="/" data-link class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              📝 PasteForge
            </a>
            <div class="flex items-center gap-4">
              <button id="copy-btn" class="btn btn-secondary">
                📋 Copy
              </button>
              <button id="theme-toggle" class="btn btn-secondary">
                <span id="theme-icon">🌙</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="card">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 class="text-2xl font-bold mb-2">Paste #${paste.id}</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                ${paste.language} • ${expiryText}
              </p>
            </div>
            <div class="flex gap-2">
              <a 
                href="/" 
                data-link
                class="btn btn-secondary"
              >
                New Paste
              </a>
            </div>
          </div>

          <!-- Code Block -->
          <div class="relative">
            <pre><code id="code-content" class="language-${paste.language}">${escapeHtml(paste.content)}</code></pre>
          </div>

          <!-- Copy Success Message -->
          <div id="copy-success" class="hidden mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400 text-center">
            ✓ Copied to clipboard!
          </div>
        </div>
      </main>
    </div>
  `;

  setupThemeToggle();

  // Syntax highlighting
  const codeElement = document.getElementById('code-content');
  if (codeElement) {
    hljs.highlightElement(codeElement);
  }

  // Copy functionality
  const copyBtn = document.getElementById('copy-btn');
  const copySuccess = document.getElementById('copy-success');
  
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      copySuccess.classList.remove('hidden');
      setTimeout(() => {
        copySuccess.classList.add('hidden');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });
}

function renderError(message) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="min-h-screen">
      <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <a href="/" data-link class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              📝 PasteForge
            </a>
            <button id="theme-toggle" class="btn btn-secondary">
              <span id="theme-icon">🌙</span>
            </button>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="card max-w-md mx-auto text-center">
          <div class="text-6xl mb-4">😕</div>
          <h2 class="text-2xl font-bold mb-4">Paste Not Found</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            ${message || 'This paste may have expired or never existed.'}
          </p>
          <a href="/" data-link class="btn btn-primary">
            Create New Paste
          </a>
        </div>
      </main>
    </div>
  `;

  setupThemeToggle();
}

function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
      const newTheme = toggleTheme();
      themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
    
    themeIcon.textContent = getTheme() === 'dark' ? '☀️' : '🌙';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatExpiry(seconds) {
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  return `${Math.floor(seconds / 86400)} days`;
}

