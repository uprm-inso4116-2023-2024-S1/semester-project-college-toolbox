// NOTE: This is where you could wire up your own data providers:
// GraphQL, Databases, REST APIs, CDNs, proxies, S3, Matrix, IPFS, you name it…

import { API_URL, REMOTE_ASSETS_BASE_URL } from '../app/constants.js';
import type {
	CourseFilters,
	Endpoint,
	EndpointsToOperations,
	ScheduleGenerationOptions,
} from '../types/entities.js';

export async function fetchData<Selected extends Endpoint>(endpoint: Selected) {
	const apiEndpoint = `${API_URL}${endpoint}`;

	console.info(`Fetching ${apiEndpoint}…`);
	return fetch(apiEndpoint)
		.then(
			(r) =>
				r.json() as unknown as Promise<
					ReturnType<EndpointsToOperations[Selected]>
				>,
		)
		.catch((e) => {
			console.error(e);
			throw Error('Invalid API data!');
		});
}

// NOTE: These helpers are useful for unifying paths, app-wide
export function url(path = '') {
	return `${import.meta.env.SITE}${import.meta.env.BASE_URL}${path}`;
}
// Generate URL for static assets (like images)
export function asset(path: string) {
	const localURL = `${import.meta.env.SITE}${import.meta.env.BASE_URL}${path}`;
	const remoteURL = `https://raw.githubusercontent.com/uprm-inso4116-2023-2024-S1/semester-project-college-toolbox/main/frontend/college-toolbox/${path}`;
	// Check if process exists and process.env.CI is defined
	if (typeof process !== 'undefined' && process.env.CI) {
		return remoteURL;
	}
	return localURL;
}

export function convertToAmPm(time24: string): string {
	// Parse the input time string
	const [hours, minutes] = time24.split(':').map(Number);

	// Check if it's a valid time
	if (
		hours === undefined ||
		minutes === undefined ||
		Number.isNaN(hours) ||
		Number.isNaN(minutes) ||
		hours < 0 ||
		hours > 23 ||
		minutes < 0 ||
		minutes > 59
	) {
		return 'Invalid time';
	}

	// Convert to am/pm format
	const period: string = hours >= 12 ? 'PM' : 'AM';
	const displayHours: number = hours % 12 || 12; // Handle 0 as 12 in 12-hour format

	// Format the result
	return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function termEnumToString(term: string): string {
	const conversions = {
		'1erSem': 'Fall',
		'2doSem': 'Spring',
		'1erVer': 'First Summer',
		'2doVer': 'Second Summer',
	};
	return (conversions as Record<string, string>)[term] ?? '';
}
/** Function that takes two 24 hour times and returns the minutes of difference */
export function subtract24HourTimes(
	startTime: string,
	endTime: string,
): number {
	const [startHour, startMinutes] = startTime.split(':').map(Number);
	const [endHour, endMinutes] = endTime.split(':').map(Number);
	if (
		startHour === undefined ||
		endHour === undefined ||
		startMinutes === undefined ||
		endMinutes === undefined
	) {
		console.error('invalid time strings inputted');
		return 0;
	}

	let totalMinutes = (endHour - startHour) * 60 + (endMinutes - startMinutes);

	// Handle negative minutes
	if (totalMinutes < 0) {
		totalMinutes += 24 * 60;
	}

	return totalMinutes;
}

export function getCurrentTimeInMinutes(): number {
	const now = new Date();
	const hours = now.getHours();
	const minutes = now.getMinutes();

	return hours * 60 + minutes;
}

export function convertCourseInformationToTextFilter(
	info: CourseFilters | undefined,
): string {
	if (info == undefined) {
		return '';
	}
	let filters = [];
	if (info.days) {
		filters.push(
			'not days : ' +
				'LMWJVSD'
					.split('')
					.filter((d) => !info.days?.includes(d))
					.join(' | '),
		);
	}
	if (info.startTime) {
		filters.push(`start time >= ${toMeridianTime(info.startTime)}`);
	}
	if (info.endTime) {
		filters.push(`end time <= ${toMeridianTime(info.endTime)}`);
	}
	if (info.professor) {
		filters.push(`professor : ${info.professor}`);
	}
	if (info.activated_filters) {
		const custom_filters = info.activated_filters.map((item) => item[1]);
		custom_filters.forEach((item) => filters.push(item));
	}
	return filters.join(', ');
}

export function getDefaultOptions(): ScheduleGenerationOptions {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	if (currentMonth < 6) {
		// Jan - May (1-5)
		return { term: '2doSem', year: `${currentYear - 1}` };
	} else if (currentMonth == 6) {
		// June (6)
		return { term: '1erVer', year: `${currentYear - 1}` };
	} else if (currentMonth == 7) {
		// July (7)
		return { term: '2doVer', year: `${currentYear - 1}` };
	} else {
		// August - Dec (8-12)
		return { term: '1erSem', year: `${currentYear}` };
	}
}

export function toMeridianTime(time: string): string {
	const time24Hour = time
		.toString()
		.match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];
	let meridianTime: string[] = [];
	if (time24Hour.length > 1) {
		// If time format correct
		meridianTime = time24Hour.slice(1); // Remove full string match value
		meridianTime[5] = +meridianTime[0] < 12 ? 'am' : 'pm'; // Set AM/PM
		meridianTime[0] = +meridianTime[0] % 12 || 12; // Adjust hours
	}
	return meridianTime.join(''); // return adjusted time or original string
}

export function getCookie(key: string): string | undefined {
	var b = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
	return b ? b.pop() : '';
}
