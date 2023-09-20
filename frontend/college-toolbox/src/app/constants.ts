export const API_URL = `${import.meta.env.BACKEND_URL}`;

export const REMOTE_ASSETS_BASE_URL = `https://college-toolbox.vercel.app`;

export const SITE_TITLE = 'College Toolbox';

/* Useful flag for sourcing from `./data` entirely, disabling randomize layer */
export const RANDOMIZE = Boolean(import.meta.env.RANDOMIZE) || true;
