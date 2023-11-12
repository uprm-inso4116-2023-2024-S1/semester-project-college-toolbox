import { persistentAtom, persistentMap } from '@nanostores/persistent';
import type { AcademicYearOptions, FilteredCourse } from '../types/entities';
import { getDefaultAcademicYearOptions } from './data';
export const $storedCourses = persistentAtom<FilteredCourse[]>('courses', [], {
	encode: JSON.stringify,
	decode: JSON.parse,
  })

export const $selectedTermYear = persistentMap<AcademicYearOptions>('courses', getDefaultAcademicYearOptions(), {
	encode: JSON.stringify,
	decode: JSON.parse,
	})
