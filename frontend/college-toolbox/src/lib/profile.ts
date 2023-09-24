import { atom, map } from 'nanostores';
import type { Profile } from '../types/entities';

export const isLoggedIn = atom(false);


export const storedProfile = map<Profile>({
	firstName: '',
	firstLastName:'',
	email: '',
	profileImageUrl: '',
});
