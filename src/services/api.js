const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function login(email, role) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role })
  });
  return res.json();
}

export async function fetchOutpasses(email) {
  const url = email ? `${API_BASE}/api/outpasses?email=${encodeURIComponent(email)}` : `${API_BASE}/api/outpasses`;
  const res = await fetch(url);
  return res.json();
}

export async function createOutpass(payload) {
  const res = await fetch(`${API_BASE}/api/outpasses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function updateOutpassStatus(id, status, approver) {
  const res = await fetch(`${API_BASE}/api/outpasses/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, approver })
  });
  return res.json();
}

export async function verifyOutpass(id, verifier) {
  const res = await fetch(`${API_BASE}/api/outpasses/${id}/verify`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verifier })
  });
  return res.json();
}