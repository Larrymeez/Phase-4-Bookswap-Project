export async function authorizedFetch(url, options = {}) {
    const token = localStorage.getItem('token')
  
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  
    const finalOptions = {
      ...options,
      headers,
    }
  
    const res = await fetch(url, finalOptions)
    return res.json()
  }
  