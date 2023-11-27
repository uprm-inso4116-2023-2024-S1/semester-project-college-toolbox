import type { Profile } from '../types/entities';

export const API_URL =
	import.meta.env.MODE === 'development'
		? 'http://localhost:5670'
		: 'https://semester-project-college-toolbox.kelvingonzalez2.repl.co';

export const REMOTE_ASSETS_BASE_URL = `https://college-toolbox.vercel.app`;

export const SITE_TITLE = 'College Toolbox';

export const EMPTY_PROFILE: Profile = {
	firstName: '',
	initial: '',
	firstLastName: '',
	secondLastName: '',
	email: '',
	profileImageUrl: '',
};
/* Useful flag for sourcing from `./data` entirely, disabling randomize layer */
export const RANDOMIZE = Boolean(import.meta.env.RANDOMIZE) || true;
