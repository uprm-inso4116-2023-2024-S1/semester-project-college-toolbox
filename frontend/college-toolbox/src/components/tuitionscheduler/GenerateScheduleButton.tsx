import React from 'react';
import { API_URL } from '../../app/constants';
import type { GeneratedSchedule, ScheduleFilters } from '../../types/entities';

interface GenerateScheduleButtonProps {
	setSchedules: React.Dispatch<React.SetStateAction<GeneratedSchedule[]>>;
	filters: ScheduleFilters;
	courses: string[] | undefined;
	term: string;
	year: string;
}

const GenerateScheduleButton: React.FC<GenerateScheduleButtonProps> = ({
	filters,
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
			const response = await fetch(`${API_URL}/schedules`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ filters, courses, term, year }),
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
			console.log(schedulesResponse);
		} catch (error) {
			console.error('An error occurred:', error);
		} finally {
		}
	};

	return (
		<button
			type="button"
			className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			onClick={handleGenerationClick}
		>
			Generate
		</button>
	);
};

export default GenerateScheduleButton;
