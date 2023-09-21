import {API_URL} from '../app/constants.js'
// authentication.ts
interface NewProfile {
	firstName: string;
	initial?: string;
	firstLastName: string;
	secondLastName?: string;
	email: string;
	password: string;
	profileImageUrl?: string;
}

interface User {
  fullName: string;
  email: string;
	profileImageUrl?: string;
}

export async function register(profile: NewProfile): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })

    if (!response.ok) {
      throw new Error('Registration failed')
    }

    const data: User = await response.json() as User
    return data

  } catch (error) {
    console.error('Registration error:', error)
		return null
  }
}

export async function login(email: string, password: string): Promise<User | null> {
  try {

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
			credentials: 'include',
      body: JSON.stringify({email, password}),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data: User = await response.json() as User
    return data

  } catch (error) {
    console.error('Login error:', error)
		return null
  }
}


export function logout() {
	const regex = /(^|;\s*)auth_token=([^;]*)/;
  const match = document.cookie.match(regex);

  if (match) {
    // Set the matched cookie to expire in the past to remove it
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
