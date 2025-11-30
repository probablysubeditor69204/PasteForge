import { createPaste } from '../utils/api.js';
import { navigate } from '../router.js';
import { getTheme, toggleTheme } from '../utils/theme.js';

const LANGUAGES = [
  { value: 'text', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'markdown', label: 'Markdown' },
];

const EXPIRY_OPTIONS = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: 'never', label: 'Never' },
];

export function renderHome() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="min-h-screen">
      <!-- Navbar -->
      <nav class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-2">
              <div class="text-3xl">📝</div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                PasteForge
              </h1>
            </div>
            <button 
              id="theme-toggle" 
              class="btn btn-secondary p-2 w-10 h-10 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <span id="theme-icon" class="text-lg">🌙</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="card max-w-5xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Create New Paste
            </h2>
            <p class="text-gray-600 dark:text-gray-400">Share your code instantly with syntax highlighting</p>
          </div>
          
          <form id="paste-form" class="space-y-6">
            <!-- Editor -->
            <div>
              <label for="content" class="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows="18"
                class="input font-mono text-sm leading-relaxed"
                placeholder="Paste your code or text here...&#10;&#10;Example:&#10;function hello() {&#10;  console.log('Hello, World!');&#10;}"
                required
              ></textarea>
            </div>

            <!-- Options Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <!-- Language -->
              <div>
                <label for="language" class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Language
                </label>
                <select id="language" name="language" class="input">
                  ${LANGUAGES.map(lang => 
                    `<option value="${lang.value}">${lang.label}</option>`
                  ).join('')}
                </select>
              </div>

              <!-- Expiry -->
              <div>
                <label for="expires" class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Expires
                </label>
                <select id="expires" name="expires" class="input">
                  ${EXPIRY_OPTIONS.map(opt => 
                    `<option value="${opt.value}">${opt.label}</option>`
                  ).join('')}
                </select>
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Password <span class="text-gray-500 dark:text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  class="input"
                  placeholder="Leave empty for public"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-center pt-4">
              <button type="submit" class="btn btn-primary px-12 py-4 text-lg font-bold">
                ✨ Create Paste
              </button>
            </div>
          </form>

          <!-- Loading State -->
          <div id="loading" class="hidden text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Creating paste...</p>
          </div>

          <!-- Error Message -->
          <div id="error" class="hidden mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400"></div>
        </div>

        <!-- Features -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div class="card text-center hover:scale-105 transition-transform duration-200">
            <div class="text-5xl mb-4">⚡</div>
            <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">Lightning Fast</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Built for speed with Redis and optimized code</p>
          </div>
          <div class="card text-center hover:scale-105 transition-transform duration-200">
            <div class="text-5xl mb-4">🔐</div>
            <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">Secure</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Optional password protection and auto-expiry</p>
          </div>
          <div class="card text-center hover:scale-105 transition-transform duration-200">
            <div class="text-5xl mb-4">🎨</div>
            <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">Beautiful UI</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Clean, modern interface with dark mode</p>
          </div>
        </div>
      </main>
    </div>
  `;

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  themeToggle.addEventListener('click', () => {
    const newTheme = toggleTheme();
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });

  // Update icon on load
  themeIcon.textContent = getTheme() === 'dark' ? '☀️' : '🌙';

  // Form submission
  const form = document.getElementById('paste-form');
  form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Get form data
  const content = document.getElementById('content').value;
  const language = document.getElementById('language').value;
  const expires = document.getElementById('expires').value;
  const password = document.getElementById('password').value;

  // Show loading
  loading.classList.remove('hidden');
  error.classList.add('hidden');
  submitBtn.disabled = true;

  try {
    const result = await createPaste({
      content,
      language,
      expires,
      password: password || null
    });

    // Navigate to paste page
    navigate(`/${result.id}`);
  } catch (err) {
    error.textContent = err.message || 'Failed to create paste';
    error.classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
    submitBtn.disabled = false;
  }
}

