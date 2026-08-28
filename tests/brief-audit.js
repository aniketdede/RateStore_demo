// Final line-by-line audit script (run against live server)
// Usage: node tests/brief-audit.js

async function run() {
  console.log('=== BRIEF AUDIT ===');
  const baseUrl = process.env.API_URL || 'http://localhost:4000';
  
  try {
    // 1. Authenticate to get fresh JWT token
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@ratestore.local', password: 'AdminPass1!' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log(loginRes.ok ? 'PASS' : 'FAIL', 'Login (admin)', loginRes.status);

    if (!token) {
      console.error('Authentication failed, skipping remaining checks.');
      return;
    }

    const checks = [
      { name: 'Admin stats', method: 'GET', url: `${baseUrl}/api/admin/dashboard`, auth: true, expect: 'totalUsers' },
      { name: 'Stores filter/sort/page', method: 'GET', url: `${baseUrl}/api/stores?page=1&limit=1`, auth: true, expect: 'data' },
      { name: 'Users filter by role', method: 'GET', url: `${baseUrl}/api/users?role=USER`, auth: true, expect: 'data' },
    ];

    for (const c of checks) {
      const opts = { method: c.method, headers: { 'Content-Type': 'application/json' } };
      if (c.auth) opts.headers.Authorization = `Bearer ${token}`;
      if (c.body) opts.body = JSON.stringify(c.body);
      const res = await fetch(c.url, opts);
      const j = await res.json();
      const pass = j[c.expect] !== undefined;
      console.log(pass ? 'PASS' : 'FAIL', c.name, res.status, j.error || '(ok)');
    }
  } catch (e) {
    console.log('FAIL', 'Audit script error:', e.message);
  }
}
run();
