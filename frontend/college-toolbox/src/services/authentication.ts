import { API_URL } from "../app/constants";
import type { NewProfile, Profile } from "../types/entities";

// authentication.ts




export async function register(profile: NewProfile): Promise<Profile | null> {
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

    const data: Profile = await response.json() as Profile
    return data

  } catch (error) {
    console.error('Registration error:', error)
		return null
  }
}

export async function login(email: string, password: string): Promise<Profile | null> {
  try {

    const response = await fetch(`http://localhost:5670/login`, {
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

    const data: Profile = await response.json() as Profile
    return data

  } catch (error) {
    console.error('Login error:', error)
		return null
  }
}

export async function fetchProfile(): Promise<Profile | null> {
    try {
  
      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
  
      if (!response.ok) {
        throw new Error('Login failed')
      }
  
      const responseData = await response.json() as {"profile": Profile}
      return responseData.profile 
  
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
