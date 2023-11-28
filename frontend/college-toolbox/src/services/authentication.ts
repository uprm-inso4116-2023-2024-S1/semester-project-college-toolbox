import { API_URL, EMPTY_PROFILE } from '../app/constants';
import type { NewProfile, Profile } from '../types/entities';
import { $storedProfile, $isLoggedIn, $authToken } from '../lib/profile';

export function logout() {
	$isLoggedIn.set('false');
	$storedProfile.set(EMPTY_PROFILE);
	$authToken.set(null);
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

		const data = (await response.json()) as { profile: Profile, token: string };
		$isLoggedIn.set('true');
		$storedProfile.set(data.profile);
		$authToken.set(data.token);
		return data.profile;
	} catch (error) {
		logout(); // Reset profile and login status
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
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			throw new Error('Login failed');
		}
		const data = (await response.json()) as { profile: Profile, token: string };
		$isLoggedIn.set('true');
		$storedProfile.set(data.profile);
		$authToken.set(data.token);
		return data.profile;
	} catch (error) {
		logout(); // Reset profile and login status
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
				// Include the JWT token in the Authorization header
				'Authorization': `Bearer ${$authToken.get()}`,
			},
		});

		if (!response.ok) {
			throw new Error('User is not logged in');
		}

		const responseData = (await response.json()) as { profile: Profile };
		$isLoggedIn.set('true');
		$storedProfile.set(responseData.profile);
		return responseData.profile;
	} catch (error) {
		logout(); // Reset profile and login status
		console.error('Failed to fetch:', error);
		return null;
	}
}

export function hasToken() {
	// You should have the JWT token stored securely after successful login
	return $authToken.get() != "";
}
