import { atom, map } from 'nanostores';
import type { Profile } from '../types/entities';
import { EMPTY_PROFILE } from "../app/constants";

export const isLoggedIn = atom(false);


export const storedProfile = map<Profile>(EMPTY_PROFILE);
