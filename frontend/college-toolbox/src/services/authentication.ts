import { API_URL, EMPTY_PROFILE } from '../app/constants';
import type { NewProfile, Profile } from '../types/entities';
import { storedProfile, isLoggedIn } from '../lib/profile';

// authentication.ts

export function logout() {
	const regex = /(^|;\s*)auth_token=([^;]*)/;
	const match = document.cookie.match(regex);

	if (match) {
		// Set the matched cookie to expire in the past to remove it
		document.cookie =
			'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
	}
	isLoggedIn.set('false');
	storedProfile.set(EMPTY_PROFILE);
}

export async function register(profile: NewProfile): Promise<Profile | null> {
	try {
		const response = await fetch(`${API_URL}/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(profile),
		});

		if (!response.ok) {
			throw new Error('Registration failed');
		}

		const data = (await response.json()) as { profile: Profile };
		isLoggedIn.set('true');
		storedProfile.set(data.profile);
		return data.profile;
	} catch (error) {
		logout(); // wipe token and reset profile and login status
		console.error('Registration error:', error);
		return null;
	}
}

export async function login(
	email: string,
	password: string,
): Promise<Profile | null> {
	try {
		const response = await fetch(`${API_URL}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			throw new Error('Login failed');
		}
		const data = (await response.json()) as { profile: Profile };
		isLoggedIn.set('true');
		storedProfile.set(data.profile);
		return data.profile;
	} catch (error) {
		logout(); // wipe token and reset profile and login status
		console.error('Login error:', error);
		return null;
	}
}

export async function fetchProfile(): Promise<Profile | null> {
	try {
		const response = await fetch(`${API_URL}/profile`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			throw new Error('User is not logged in');
		}

		const responseData = (await response.json()) as { profile: Profile };
		isLoggedIn.set('true');
		storedProfile.set(responseData.profile);
		return responseData.profile;
	} catch (error) {
		logout(); // wipe token and reset profile and login status
		console.error('Failed to fetch:', error);
		return null;
	}
}

export function hasToken() {
	const regex = /(^|;\s*)auth_token=([^;]*)/;
	const match = document.cookie.match(regex);
	return match != null;
}
