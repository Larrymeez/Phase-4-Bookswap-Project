export async function authorizedFetch(url, options = {}) {
  const token = localStorage.getItem('token')
  console.log('Sending token:', token)

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const finalOptions = {
    ...options,
    headers,
    credentials: 'include',  // ✅ Required for cross-origin requests
  }

  const res = await fetch(url, finalOptions)

  // Handle non-2xx responses more safely
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HTTP ${res.status}: ${err}`)
  }

  return res.json()
}

