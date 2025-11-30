const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function createPaste(data) {
  const response = await fetch(`${API_URL}/paste`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create paste');
  }

  return response.json();
}

export async function getPaste(id) {
  const response = await fetch(`${API_URL}/paste/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch paste');
  }

  return response.json();
}

export async function verifyPassword(id, password) {
  const response = await fetch(`${API_URL}/paste/${id}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Invalid password');
  }

  return response.json();
}

export async function deletePaste(id) {
  const response = await fetch(`${API_URL}/paste/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete paste');
  }

  return response.json();
}

