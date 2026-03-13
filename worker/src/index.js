// LeetDaily Preferences Sync Worker
// Cloudflare Worker + KV for cross-device preference syncing

const ALLOWED_KEYS = new Set([
  'requirements',
  'orModeRequirements',
  'notificationsEnabled',
  'reminderTime',
  'badgeStreakEnabled'
]);

const USERNAME_RE = /^[a-zA-Z0-9_-]{1,39}$/;
const MAX_BODY_SIZE = 4096;

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  // Allow Chrome extension origins and localhost for dev
  const allowed = origin.startsWith('chrome-extension://') || origin.startsWith('http://localhost');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : '',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request),
    },
  });
}

function sanitizePrefs(body) {
  const clean = {};
  for (const key of ALLOWED_KEYS) {
    if (key in body) {
      clean[key] = body[key];
    }
  }
  return clean;
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/prefs\/([^/]+)$/);

    if (!match) {
      return jsonResponse({ error: 'Not found' }, 404, request);
    }

    const username = match[1].toLowerCase();

    if (!USERNAME_RE.test(username)) {
      return jsonResponse({ error: 'Invalid username' }, 400, request);
    }

    // GET /prefs/:username
    if (request.method === 'GET') {
      const value = await env.PREFS.get(username, 'json');
      if (!value) {
        return jsonResponse({ error: 'Not found' }, 404, request);
      }
      return jsonResponse(value, 200, request);
    }

    // PUT /prefs/:username
    if (request.method === 'PUT') {
      const contentLength = parseInt(request.headers.get('content-length') || '0');
      if (contentLength > MAX_BODY_SIZE) {
        return jsonResponse({ error: 'Payload too large' }, 413, request);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON' }, 400, request);
      }

      const prefs = sanitizePrefs(body);
      prefs.updatedAt = new Date().toISOString();

      await env.PREFS.put(username, JSON.stringify(prefs));

      return jsonResponse({ ok: true, updatedAt: prefs.updatedAt }, 200, request);
    }

    return jsonResponse({ error: 'Method not allowed' }, 405, request);
  },
};
