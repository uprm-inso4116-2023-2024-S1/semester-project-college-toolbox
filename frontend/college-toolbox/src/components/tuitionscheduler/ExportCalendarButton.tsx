import React from 'react';
import { API_URL } from '../../app/constants';
import type { GeneratedSchedule } from '../../types/entities';
import { $authToken } from '../../lib/profile';
interface ExportButtonProps {
	schedule: GeneratedSchedule | undefined;
	term: string;
	year: string;
}

const ExportCalendarButton: React.FC<ExportButtonProps> = ({
	schedule,
	term,
	year,
}) => {
	const handleDownloadClick = async () => {
		try {
			if (!schedule) return;

			const response = await fetch(`${API_URL}/export_calendar`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${$authToken.get()}`,
				},
				body: JSON.stringify({ schedule, term, year }),
			});

			if (!response.ok) {
				// Handle error, show a message, or throw an exception
				console.error('Failed to fetch calendar data');
				return;
			}

			const filename =
				response.headers
					?.get('content-disposition')
					?.match(/filename\*?=['"]?([^'"]*)['"]?/)
					?.at(1) ?? `${term}-${year}-calendar.ics`;
			// Convert the response to a Blob
			const blob = await response.blob();

			// Create a download link
			const downloadLink = document.createElement('a');
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.download = filename;

			// Trigger the download
			document.body.appendChild(downloadLink);
			downloadLink.click();

			// Cleanup
			document.body.removeChild(downloadLink);
		} catch (error) {
			console.error('An error occurred:', error);
		} finally {
		}
	};

	return (
		<button
			type="button"
			className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:dark:bg-gray-500"
			onClick={handleDownloadClick}
			disabled={!schedule}
		>
			Export
		</button>
	);
};

export default ExportCalendarButton;
