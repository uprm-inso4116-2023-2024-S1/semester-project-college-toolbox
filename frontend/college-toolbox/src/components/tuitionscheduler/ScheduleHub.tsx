import React from 'react';
import { API_URL } from '../../app/constants';
import WeeklyCalendar from './WeeklyCalendar';
import ExportCalendarButton from './ExportCalendarButton';


interface ScheduleHubProps {
}

const ScheduleHub: React.FC<ScheduleHubProps> = () => {
	

  return (
		<div className="w-full pt-2">

		<form className="flex items-center">
					<label htmlFor="simple-search" className="sr-only">
						Search
					</label>
					<div className="relative w-full">
						<input
							type="text"
							id="simple-search"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Search course... ie. INSO4116, CIIC4050-101L, etc."
							required
						/>
					</div>
					<button
						type="submit"
						className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						<svg
							className="w-4 h-4"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
						<span className="sr-only">Search</span>
					</button>
				</form>
			 <WeeklyCalendar courses={[{
			courseCode: "ALEM3041",
			courseName: "ALEMAN I",
			professor: 'Albert',
			credits: 3,
			sectionId: 25,
			sectionCode: "030",
			timeBlocks: [{
										room:"CH403",
										day: 0,
										startTime:"09:30",
										endTime:"10:20"
									},
									{
										room:"CH403",
										day: 2,
										startTime:"09:30",
										endTime:"10:20"
									},
									{
										room:"CH403",
										day: 4,
										startTime:"09:30",
										endTime:"10:20"
									}]
		}]} term='1erSem' year='2023'/>
    	 <ExportCalendarButton section_ids={[2191,1378,1334]} term='1erSem' year='2023' />

		</div>
  );
};

export default ScheduleHub;
