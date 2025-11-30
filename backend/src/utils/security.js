// HTML escaping to prevent XSS
export function escapeHtml(text) {
  if (typeof text !== 'string') {
    return text;
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Validate expiry option
export function isValidExpiry(expires) {
  const validOptions = ['1h', '24h', '7d', 'never'];
  return validOptions.includes(expires);
}

// Validate language
export function isValidLanguage(language) {
  // Common languages supported by highlight.js
  const validLanguages = [
    'text', 'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'html', 'css',
    'json', 'xml', 'yaml', 'markdown', 'sql', 'bash', 'shell', 'dockerfile',
    'nginx', 'apache', 'diff', 'ini', 'toml', 'makefile', 'cmake'
  ];
  return validLanguages.includes(language?.toLowerCase() || 'text');
}

