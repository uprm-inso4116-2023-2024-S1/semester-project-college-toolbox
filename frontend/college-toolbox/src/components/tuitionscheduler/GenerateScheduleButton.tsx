import React from 'react';
import { API_URL } from '../../app/constants';
import type {
	FilteredCourse,
	GeneratedSchedule,
	ScheduleGenerationOptions,
} from '../../types/entities';
import { convertCourseInformationToTextFilter } from '../../lib/data';

interface GenerateScheduleButtonProps {
	setSchedules: React.Dispatch<React.SetStateAction<GeneratedSchedule[]>>;
	options: ScheduleGenerationOptions;
	courses: FilteredCourse[] | undefined;
	term: string;
	year: string;
}

const GenerateScheduleButton: React.FC<GenerateScheduleButtonProps> = ({
	options,
	setSchedules,
	courses,
	term,
	year,
}) => {
	const handleGenerationClick = async () => {
		if (!courses) {
			return;
		}
		try {
			const coursesWithTextFilters = courses.map((course) => ({
				code: course.code,
				filters: convertCourseInformationToTextFilter(course.filters),
			}));
			const response = await fetch(`${API_URL}/schedules`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					options,
					courses: coursesWithTextFilters,
					term,
					year,
				}),
				credentials: 'include',
			});

			if (!response.ok) {
				// Handle error, show a message, or throw an exception
				console.error('Failed to generate schedules');
				return;
			}
			// update the Generated Schedules
			const schedulesResponse = await response.json();
			setSchedules(schedulesResponse.schedules);
		} catch (error) {
			console.error('An error occurred:', error);
		} finally {
		}
	};

	return (
		<button
			type="button"
			className={`text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:dark:bg-gray-500`}
			onClick={handleGenerationClick}
			disabled={!courses || courses.length === 0}
		>
			Generate
		</button>
	);
};

export default GenerateScheduleButton;
