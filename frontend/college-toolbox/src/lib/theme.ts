import { persistentAtom } from '@nanostores/persistent'

export const $isDarkMode = persistentAtom<'true' | 'false'>('dark-mode', 'false');
