import { persistentAtom } from '@nanostores/persistent';
import type { FilteredCourse } from '../types/entities';

export const storedCourses = persistentAtom<FilteredCourse[]>('courses', [], {
	encode: JSON.stringify,
	decode: JSON.parse,
  })