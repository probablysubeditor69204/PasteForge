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
      <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-14">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              PasteForge
            </h1>
            <button 
              id="theme-toggle" 
              class="btn btn-secondary p-2"
              aria-label="Toggle theme"
            >
              <span id="theme-icon">🌙</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="card">
          <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            Create New Paste
          </h2>
          
          <form id="paste-form" class="space-y-5">
            <!-- Editor -->
            <div>
              <label for="content" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows="20"
                class="input"
                placeholder="Paste your code or text here..."
                required
              ></textarea>
            </div>

            <!-- Options Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Language -->
              <div>
                <label for="language" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                <label for="expires" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                <label for="password" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Password <span class="text-gray-500 dark:text-gray-400 text-xs">(optional)</span>
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
            <div class="flex justify-end pt-2">
              <button type="submit" class="btn btn-primary px-6">
                Create Paste
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
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4">
            <div class="text-2xl mb-2">⚡</div>
            <h3 class="font-semibold mb-1 text-sm">Fast</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">Redis-powered</p>
          </div>
          <div class="text-center p-4">
            <div class="text-2xl mb-2">🔐</div>
            <h3 class="font-semibold mb-1 text-sm">Secure</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">Password protection</p>
          </div>
          <div class="text-center p-4">
            <div class="text-2xl mb-2">🎨</div>
            <h3 class="font-semibold mb-1 text-sm">Clean</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">Simple interface</p>
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

