// authentication.ts

import { API_URL } from "../app/constants";
import { url } from '../lib/data.js';

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
      body: JSON.stringify({ profile }),
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

export function submitRegisterForm(event: Event) {
	event.preventDefault()

	// Get form data from the DOM
	const formData = {
		firstName: document.getElementById('firstName')?.value as string,
		middleInitial: document.getElementById('middleInitial')?.value as string,
		firstLastName: document.getElementById('firstLastName')?.value as string,
		secondLastName: document.getElementById('secondLastName')?.value as string,
		email: document.getElementById('email')?.value as string,
		password: document.getElementById('password')?.value as string,
	}

	// Call the register function with form data
	register(formData)
		.then((user) => {
			if (user) {
				// Registration was successful, navigate to the home page
				location.href = url('')
			} else {
				// Handle registration failure (e.g., show an error message)
				console.error('Registration failed')
			}
		})
		.catch((error) => {
			console.error('Error during registration:', error)
		})
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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
