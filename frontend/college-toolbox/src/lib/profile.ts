import { persistentAtom, persistentMap } from '@nanostores/persistent';
import type { Profile } from '../types/entities';
import { EMPTY_PROFILE } from '../app/constants';

export const $isLoggedIn = persistentAtom<'true' | 'false'>('loggedIn', 'false');

export const $storedProfile = persistentMap<Profile>('profile:', EMPTY_PROFILE, {
	encode: JSON.stringify,
	decode: JSON.parse,
});

export const $authToken = persistentAtom<string>('token:', "");
